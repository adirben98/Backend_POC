const OpenAi = require("openai");
const openai = new OpenAi({
});

async function generateStory(req, res) {
  const { hero, prompt } = req.body;
  const story = await storyFetch(hero, prompt);
  const elements = await keyElementsDescription(story);
  let prompts = [];
  for (let i = 0; i < story.length; i++) {
    prompts.push(await promptCreation(story[i], elements));
  }
  const description=await generateDescription(story)
  const title = await generateTitle(story);
  const coverImg = await generateCover(title,description);

  res.send({
    story: story,
    prompts: prompts,
    coverImg: coverImg,
    description:description,
    title:title
  });
}
async function generateCover(title,description) {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate a cover image for a story titled ${title} and the description of the story is: ${description}`,
          },
        ],
      },
    ],
    model: "dall-e-3",
  });
  return completions.choices[0].message.content;
}
async function generateTitle(story) {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate a title for the story that is being read in the next paragraphs: ${story}`,
          },
        ],
      },
    ],
    model: "gpt-4o",
  });
  return completions.choices[0].message.content;
}
async function generateDescription(story) {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate a short description for the story that is being read in the next paragraphs: ${story}`,
          },
        ],
      },
    ],
    model: "gpt-4o",
  });
  return completions.choices[0].message.content;
}

async function storyFetch(hero, prompt) {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate an exactly five paragraph(make sure that after each paragraph you end the paragraph with only two \n\n) children story that the main character of it is ${hero} and the content of the story should rely on the next prompt: ${prompt}`,
          },
        ],
      },
    ],
    model: "gpt-4o",
  });
  console.log(completions.choices[0].message.content);
  const story = completions.choices[0].message.content;
  return story.split("\n\n");
}
async function keyElementsDescription(story) {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `tell me all the key visual elements of the story:${story} and discribe for me each as detail as you can by appearance( color of the hair, how his beard looks like. every detail is important!) , age(if it is alive), distinctive features, colors, clothing(color of his shoes, color of shirt , if he has a mask, every garmet that the image wears etc...), emotional expressions, and also add the places described where the scenes are taken. Make sure to start your answer without any introduction. I need the answer to be in this structure: **Character name**: Description... .`,
          },
        ],
      },
    ],
    model: "gpt-4o",
  });
  return completions.choices[0].message.content;
}
async function promptCreation(paragraph, settings) {
  const example =
    "Create a photo illustrating Spider-Man and Times Square\n\nPhoto description: The scene captures a bustling Times Square (description: A bustling hub in New York City, glowing with giant digital billboards and colorful lights. The streets are packed with people, who, in this scene, are initially under the influence of Joker's toxic laughing gas. The evening ambiance is filled with artificial light reflecting off the surrounding skyscrapers, a significant landmark of the city's incessant energy). The digital billboards display Joker's (description: The Joker is a notorious villain with a flamboyant and unsettling appearance. He has green hair, slicked back, and a pale white face with bright red lips stretched into a perpetual, disturbing grin. His eyes are heavily lined with black makeup, enhancing his manic expression. He is dressed in a garish ringmaster's outfit, which includes a purple tailcoat with green accents, yellow vest, plaid pants, and polished black shoes. He also carries a twirling cane. His age appears to be in his mid-forties) sinister face grinning mischievously. \n\nIn the midst of the chaos, Spider-Man (description: Spider-Man, under his iconic mask, is Peter Parker, a young man in his early twenties with short, brown hair and a clean-shaven face. His Spider-Man suit is a vibrant combination of red and blue. The suit features a large black spider emblem on the chest, web patterns across the red parts, and white eyes outlined in black on the mask. His gloves and boots are primarily red, and he wears web shooters on his wrists) is seen donning a protective mask, preparing his web-shooters. He stands on a rooftop overlooking the square, ready to seal the hidden vents that are spraying Joker's toxic laughing gas. The crowd below shows visible signs of confusion and panic gradually subsiding as Spider-Man disperses an antidote mist from his web-shooters. The overall mood transitions from chaotic and sinister to calm and relieved, captured in the bewildered yet smiling faces of the crowd below.";

  const completions = await openai.chat.completions.create({
    messages: [
      {
        
        role: "user",
        content: [
          {
            
            type: "text",
            text: `Create a short prompt that describe a photo that reflects the scene that being read in the paragraph. This is the paragraph you should make the prompt on:${paragraph}. After you created the prompt, scan the prompt and when you encounter a setting from the:${settings} what i need you to do is to add the character's or the place's right setting after the name of the setting.This is an example to how you should make your prompt correctly: ${example}. Make sure to start your answer without any introduction. In addition make sure you make a description to every element in the paragraph. Every character whenever mentioned gets a description.  Dont add ** before the prompt or after it. finally scan the prompt and make sure the prompt not exceeding 4000 charcters, which means that if it does exceed, you should elimenate unneccessery words but still make the contest as it was.`,
          },
        ],
      },
    ],
    model: "gpt-4o",
    max_tokens: 3800,
  });
  return completions.choices[0].message.content;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generatePhoto(req, res) {
  const style = {
    Spiderman: "realistic",
    "Coca-Cola man": "realistic",
    SpongeBob: "vibrant and cartoonish",
    Hulk: "realistic",
  };
  const { hero, prompt } = req.body;
  console.log(style[hero]);

  let delay = 1000; // initial delay of 1 second
  const maxDelay = 32000; // maximum delay of 32 seconds

  while (true) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Generate an image according to this prompt: ${prompt}, make the images in the photo in style of ${style[hero]}.`,
      });

      const data = response;
      if (data && data.data && data.data.length > 0) {
        console.log(data.data[0].url);
        return res.status(200).send(data.data[0].url);
      } else {
        console.log("Failed to generate image");
        console.log(response);
      }
    } catch (error) {
      console.error("Error in generatePhoto:", error);
      await sleep(delay);
      delay = Math.min(delay * 2, maxDelay); // Exponential backoff
    }
  }
}



module.exports = { generatePhoto, storyFetch, generateStory };
