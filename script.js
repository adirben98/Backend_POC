const book = require("./bookModel");
let currentPage = 0;
let storyData = {
  paragraphs: [],
  prompts: [],
  images: [],
  title: "",
  coverImg: "",
  description: "",
};
window.onload = async function () {
  try {
    Array.from(document.getElementsByClassName("next")).forEach((element) => {
      element.style.display = "none";
    });

    const response = await axios.post(
      "http://localhost:3000/generate",
      {
        hero: localStorage.getItem("hero"),
        prompt: localStorage.getItem("prompt"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    storyData.paragraphs = data.story;
    storyData.prompts = data.prompts;
    storyData.coverImg = data.coverImg;
    storyData.description = data.description;
    storyData.title = data.title;

    // Set the cover image
    document.getElementById("cover-image").src = storyData.coverImg;

    Array.from(document.getElementsByClassName("next")).forEach((element) => {
      element.style.display = "block";
    });

    console.log(storyData);
  } catch (err) {
    console.error("Error making POST request:", err);
  }
};


async function nextPage() {
  if (currentPage === 0) {
    document.getElementById("book-cover").style.display = "none";
    document.getElementById("story-page").style.display = "block";
    document.getElementById("image-page").style.display = "block";

    document.getElementById("the-end").style.display = "none";
  }

  if (currentPage < storyData.paragraphs.length) {
    document.getElementById("story-text").textContent =
      storyData.paragraphs[currentPage];
    if (!storyData.images[currentPage]) {
      document.getElementById("story-image").src = "";

      await generateImage();
    }
    document.getElementById("story-image").src = storyData.images[currentPage];
    currentPage++;
    Array.from(document.getElementsByClassName("next")).forEach((element) => {
      element.style.display = "block";
    });
    document.getElementById("prev").style.display = "block";
  } else {
    document.getElementById("the-end").style.display = "block";
    document.getElementById("story-page").style.display = "none";
    document.getElementById("image-page").style.display = "none";
  }
}
function previousPage() {
  currentPage--;

  if (currentPage === 0) {
    document.getElementById("book-cover").style.display = "block";
    document.getElementById("story-page").style.display = "none";
    document.getElementById("image-page").style.display = "none";
  } else {
    if (currentPage === storyData.paragraphs.length - 1) {
      document.getElementById("the-end").style.display = "none";
      document.getElementById("image-page").style.display = "block";
      document.getElementById("story-page").style.display = "block";
    }
    document.getElementById("story-text").textContent =
      storyData.paragraphs[currentPage - 1];
    document.getElementById("story-image").src =
      storyData.images[currentPage - 1];
  }
}

async function refreshImage() {
  const tmp = currentPage - 1;
  document.getElementById("refresh").style.display = "none";
  Array.from(document.getElementsByClassName("next")).forEach((element) => {
    element.style.display = "none";
  });
  document.getElementById("prev").style.display = "none";
  const photo = await axios.post(
    "http://localhost:3000/generatePhoto",
    {
      hero: localStorage.getItem("hero"),
      prompt: storyData.prompts[tmp],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  document.getElementById("refresh").style.display = "block";

  Array.from(document.getElementsByClassName("next")).forEach((element) => {
    element.style.display = "block";
  });
  document.getElementById("prev").style.display = "block";
  storyData.images[tmp] = photo.data;
  document.getElementById("story-image").src = storyData.images[tmp];
}
async function generateImage() {
  document.getElementById("refresh").style.display = "none";

  Array.from(document.getElementsByClassName("next")).forEach((element) => {
    element.style.display = "none";
  });
  document.getElementById("prev").style.display = "none";
  const photo = await axios.post(
    "http://localhost:3000/generatePhoto",
    {
      hero: localStorage.getItem("hero"),
      prompt: storyData.prompts[currentPage],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  storyData.images.push(photo.data);
  document.getElementById("refresh").style.display = "block";

  Array.from(document.getElementsByClassName("next")).forEach((element) => {
    element.style.display = "block";
  });
  document.getElementById("prev").style.display = "block";
}

async function save() {
  try {
    book.create({
      title: storyData.title,
      author: "Idan the author",
      authorImg: "https://cdn-icons-png.flaticon.com/512/1995/1995571.png",
      images: storyData.images,
      paragraphs: storyData.paragraphs,
      description: storyData.description,
      coverImg: storyData.coverImg,
    });
  } catch (err) {
    console.log(err);
  }
}
