import { sendMessage } from '../../websockets/chat'

let chunks: Blob[] = []
let mediaRecorder: MediaRecorder | null = null
let stream: MediaStream | null = null

export async function initMicrophone() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder = new MediaRecorder(stream)

  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data)
  }
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
    sendMessage(blob)
    chunks = []

    stream?.getTracks().forEach((track) => track.stop())
    mediaRecorder = null
    stream = null
  }
}

export async function startRecording() {
  if (!mediaRecorder) await initMicrophone()

  mediaRecorder?.start()
}

export function stopRecording() {
  mediaRecorder?.stop()
}
