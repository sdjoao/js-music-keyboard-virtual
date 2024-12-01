const state = {
    pianoKeys: {
        keys: document.querySelectorAll(".piano-keys .key"),
    },
    volumeSlider: {
        volume: document.querySelector(".volume-slider input"),
    },
    toggleButton: {
        keysCheck: document.querySelector(".keys-check input"),
    },
    recording: {
        isRecording: false,
        recordedNotes: [],
        recordingStartTime: null,
        recordButton: document.getElementById("recordButton"),
        playButton: document.getElementById("playButton"),
    },
};

let mapedKeys = [];
let audio = new Audio("./src/tunes/a.wav");

const playTune = (key) => {
    audio.src = `src/tunes/${key}.wav`;
    audio.play();

    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    clickedKey.classList.add("active");
    setTimeout(() => {
        clickedKey.classList.remove("active");
    }, 150);

    if (state.recording.isRecording) {
        const timeStamp = Date.now() - state.recording.recordingStartTime;
        state.recording.recordedNotes.push({ key, timeStamp });
    }
};

state.pianoKeys.keys.forEach((key) => {
    key.addEventListener("click", () => playTune(key.dataset.key));
    mapedKeys.push(key.dataset.key);
});

document.addEventListener("keydown", (e) => {
    if (mapedKeys.includes(e.key)) {
        playTune(e.key);
    }
});

const handleVolume = (e) => {
    audio.volume = e.target.value;
};
state.volumeSlider.volume.addEventListener("input", handleVolume);

const showHideKeys = () => {
    state.pianoKeys.keys.forEach((key) => key.classList.toggle("hide"));
};
state.toggleButton.keysCheck.addEventListener("click", showHideKeys);

const toggleRecording = () => {
    state.recording.isRecording = !state.recording.isRecording;
    if (state.recording.isRecording) {
        state.recording.recordedNotes = [];
        state.recording.recordingStartTime = Date.now();
        state.recording.recordButton.textContent = "Parar Gravação";
        state.recording.playButton.disabled = true;
    } else {
        state.recording.recordButton.textContent = "Gravar";
        state.recording.playButton.disabled = state.recording.recordedNotes.length === 0;
    }
};

const playRecording = () => {
    if (state.recording.recordedNotes.length === 0) return;

    state.recording.recordedNotes.forEach((note) => {
        setTimeout(() => {
            playTune(note.key);
        }, note.timeStamp);
    });
};

state.recording.recordButton.addEventListener("click", toggleRecording);
state.recording.playButton.addEventListener("click", playRecording);
