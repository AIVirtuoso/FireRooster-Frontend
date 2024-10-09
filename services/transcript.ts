import apiClient from "../axios";

export const transcriptService = {
  async getTranscriptByModels(formData: FormData) {
    const endPoint = `${process.env.NEXT_PUBLIC_Audio_Base_URL}api/v1/transcript`;
    try {
      const res = await fetch(endPoint, {
        method: 'POST',
        body: formData
      });
      return res.json();
    } catch (error) {
      console.log(error)
    }
  },
  async getTranscriptByGPT(formData: FormData) {
    const endPoint = `${process.env.NEXT_PUBLIC_Audio_Base_URL}api/v1/clear-transcript`;
    try {
      const res = await fetch(endPoint, {
        method: 'POST',
        body: formData
      });
      return res.json();
    } catch (error) {
      console.log(error)
    }
  },
  async setTranscriptPrompt(formData: FormData) {
    const endPoint = `${process.env.NEXT_PUBLIC_Audio_Base_URL}api/v1/set-transcript-prompt`;
    try {
      const res = await fetch(endPoint, {
        method: 'POST',
        body: formData
      });
      return res.json();
    } catch (error) {
      console.log(error)
    }
  },
  async getTranscriptPrompt() {
    const endPoint = `${process.env.NEXT_PUBLIC_Audio_Base_URL}api/v1/get-transcript-prompt`;
    try {
      const res = await fetch(endPoint, {
        method: 'POST',
      });
      return res.json();
    } catch (error) {
      console.log(error)
    }
  },

};
