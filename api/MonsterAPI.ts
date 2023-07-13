import axios from "axios";

const STEPS = 50
const SEED = 2414
const GUIDANCE_SCALE = 7.5

const taskStatus = 'https://api.monsterapi.ai/apis/task-status'
const addTask =  'https://api.monsterapi.ai/apis/add-task'

const xApiKey = 'API_TOKEN'
const bearerToken = 'BEARER_TOKEN_HERE'

export enum AspectRatio {
    Square = "square",
    Landscape = "landscape",
    Portrait = "portrait"
}

interface AddTaskMessage {
  message: string
  process_id: string
}

interface TaskStatusMessage {
  message: string;
  response_data: {
    process_id: string;
    status: string;
    result: {
      output: string[];
    };
    credit_used: number;
    overage: number;
  };
}

const sendRequestToMonsterapi = async (data : string) => {
    let config = {
        method: 'post',
        url: addTask,
        headers: { 
            'x-api-key': xApiKey, 
            'Authorization': bearerToken, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    let response_data : AddTaskMessage

    try {
      let response = await axios(config)
      response_data = response.data as AddTaskMessage
    } catch(exc) {

      throw exc
    }

    return response_data
}

const fetchRequest = async (data: string) => {
  let config = {
    method: 'post',
    url: taskStatus,
    headers: { 
      'x-api-key': xApiKey, 
      'Authorization': bearerToken, 
      'Content-Type': 'application/json'
  },
    data : data
  };  

  let response_data : TaskStatusMessage

  do {

    try { 
      let response = await axios(config)
      response_data = response.data as TaskStatusMessage
    } catch(exc) {

      throw exc
    }

  } while(response_data.response_data.status !== "COMPLETED")
    
  console.log("response_data ", response_data)
  return response_data.response_data.result.output
}

export const textToImage = async (prompt : string, numSamples : number, aspectRatio : AspectRatio) => {
    let promptData = JSON.stringify({
        "model": "txt2img",
        "data": {
          "prompt": prompt,
          "negprompt": "",
          "samples": numSamples,
          "steps": STEPS,
          "aspect_ratio": aspectRatio,
          "guidance_scale": GUIDANCE_SCALE,
          "seed": SEED
        }
      });
      
    let images : string[] = []

    try {
      let addTask = await sendRequestToMonsterapi(promptData)

      if (addTask.message !== "Request accepted successfully") {
        throw Error("Request was not accepted successfully")
      }

      let fetchData = JSON.stringify({
        "process_id": addTask.process_id
      });
      
      

      images = await fetchRequest(fetchData)
    } catch(exc) {
      console.error(exc)
    }
  
    return images
}

export const imageToImage = async (prompt : string, initialImage : string, samples : number, aspectRatio : AspectRatio, strength : number = 0.75) => {
    let data = JSON.stringify({
        "model": "txt2img",
        "data": {
          "prompt": prompt,
          "negprompt": "",
          "samples": samples,
          "steps": STEPS,
          "init_image_url": initialImage,
          "strength": strength,
          "aspect_ratio": aspectRatio,
          "guidance_scale": GUIDANCE_SCALE,
          "seed": SEED
        }
      });
      
    return await sendRequestToMonsterapi(data)
}

export const imageEditing = async (prompt : string, initialImage : string, samples : number, aspectRatio : AspectRatio, strength : number = 0.75) => {
  let data = JSON.stringify({
        "model": "pix2pix",
        "data": {
          "prompt": prompt,
          "negprompt": "",
          "samples": samples,
          "steps": STEPS,
          "init_image_url": initialImage,
          "strength": strength,
          "aspect_ratio": aspectRatio,
          "guidance_scale": GUIDANCE_SCALE,
          "seed": SEED
        }
      });
      
    return await sendRequestToMonsterapi(data)
}
