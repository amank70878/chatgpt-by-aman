import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebase__db } from "../firebaseConfig";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.REACT_APP_ORG,
  apiKey: process.env.REACT_APP_CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const fetchModels = async (setModels) => {
  const response = await openai.listModels();
  setModels(response.data.data);
};
fetchModels();

export const callChatGtp = async (
  input,
  setResult,
  chatid,
  user,
  setLoading,
  currentModel
) => {
  setLoading(true);
  await openai
    .createCompletion({
      model: currentModel,
      prompt: input,
      max_tokens: 1000,
      temperature: 0.8,
    })
    .then(async (response) => {
      setResult({
        message: response.data.choices[0].text,
        user__name: "chatgpt",
      });
      await addDoc(
        collection(
          firebase__db,
          "users",
          user.email,
          "chats",
          chatid,
          "message"
        ),
        {
          message: response.data.choices[0].text,
          user__name: "chatgpt",
          timestamp: serverTimestamp(),
        }
      );
    })
    .catch(async () => {
      await addDoc(
        collection(
          firebase__db,
          "users",
          user.email,
          "chats",
          chatid,
          "message"
        ),
        {
          message: "Something went Wrong",
          user__name: "chatgpt",
          timestamp: serverTimestamp(),
        }
      );
    });
};
