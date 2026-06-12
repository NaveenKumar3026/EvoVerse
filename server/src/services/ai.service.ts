import axios from "axios";

export const generateWorldStory =
  async (
    worldId: string
  ) => {

    const prompt = `
    Write a short science fiction history
    of a galaxy.

    World ID:
    ${worldId}

    Describe:
    - strongest civilization
    - wars
    - alliances
    - technological growth

    Make it sound like a galactic historian.
    `;

    const response =
      await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3",
          prompt,
          stream: false,
        }
      );

    return response.data.response;
  };