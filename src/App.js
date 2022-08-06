import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [property, setProperty] = useState({
    fileInput: "",
    filterOptions: "",
    filterName: "",
    filterValue: "",
    filterSlider: "",
    rotateOptions: "",
    previewImg: "",
    resetFilterBtn: "",
    chooseImgBtn: "",
    saveImgBtn: "",
  });
  const [filterOption, setFilterOption] = useState("brightness");
  useEffect(() => {
    setProperty((prevState) => ({
      ...prevState,
      fileInput: document.querySelector(".file-input"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      filterOptions: document.querySelectorAll(".filter button"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      filterName: document.querySelector(".filter-info .name"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      filterValue: document.querySelector(".filter-info .value"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      filterSlider: document.querySelector(".slider input"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      rotateOptions: document.querySelectorAll(".rotate button"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      previewImg: document.querySelector(".preview-img img"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      resetFilterBtn: document.querySelector(".reset-filter"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      chooseImgBtn: document.querySelector(".choose-img"),
    }));
    setProperty((prevState) => ({
      ...prevState,
      saveImgBtn: document.querySelector(".save-img"),
    }));
  }, []);

  let brightness = "100",
    saturation = "100",
    inversion = "0",
    grayscale = "0";
  let rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1;

  const loadImage = () => {
    property.fileInput.click();
    let file = property.fileInput.files[0];
    if (!file) return;
    property.previewImg.src = URL.createObjectURL(file);
    property.previewImg.addEventListener("load", () => {
      property.resetFilterBtn.click();
      document.querySelector(".container").classList.remove("disable");
    });
    updateFilter();
  };

  const applyFilter = () => {
    property.previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    property.previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  };

  const updateFilter = () => {
    property.filterValue.innerText = `${property.filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
      brightness = property.filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
      saturation = property.filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
      inversion = property.filterSlider.value;
    } else {
      grayscale = property.filterSlider.value;
    }
    applyFilter();
  };

  const resetFilter = () => {
    brightness = "100";
    saturation = "100";
    inversion = "0";
    grayscale = "0";
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    property.filterOptions[0].click();
    applyFilter();
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = property.previewImg.naturalWidth;
    canvas.height = property.previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
      ctx.rotate((rotate * Math.PI) / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(
      property.previewImg,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleChoose = () => {
    property.fileInput.click();
    setFilterOption("");
  };

  const rotateAndFlip = (option) => {
    if (option === "left") {
      rotate -= 90;
    } else if (option === "right") {
      rotate += 90;
    } else if (option === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  };

  const selectFilterOption = (filterOption) => {
    setFilterOption(filterOption);
    if (filterOption === "brightness") {
      property.filterSlider.max = "200";
      property.filterSlider.value = brightness;
      property.filterValue.innerText = `${brightness}%`;
    } else if (filterOption === "saturation") {
      property.filterSlider.max = "200";
      property.filterSlider.value = saturation;
      property.filterValue.innerText = `${saturation}%`;
    } else if (filterOption === "inversion") {
      property.filterSlider.max = "100";
      property.filterSlider.value = inversion;
      property.filterValue.innerText = `${inversion}%`;
    } else {
      property.filterSlider.max = "100";
      property.filterSlider.value = grayscale;
      property.filterValue.innerText = `${grayscale}%`;
    }
  };

  return (
    <div class="container disable">
      <h2>Easy Image Editor</h2>
      <div class="wrapper">
        <div class="editor-panel">
          <div class="filter">
            <label class="title">Filters</label>
            <div class="options">
              <button
                onClick={() => selectFilterOption("brightness")}
                id="brightness"
                class={filterOption === "brightness" && "active"}
              >
                Brightness
              </button>
              <button
                onClick={() => selectFilterOption("saturation")}
                id="saturation"
                class={filterOption === "saturation" && "active"}
              >
                Saturation
              </button>
              <button
                onClick={() => selectFilterOption("inversion")}
                id="inversion"
                class={filterOption === "inversion" && "active"}
              >
                Inversion
              </button>
              <button
                onClick={() => selectFilterOption("grayscale")}
                id="grayscale"
                class={filterOption === "grayscale" && "active"}
              >
                Grayscale
              </button>
            </div>
            <div class="slider">
              <div class="filter-info">
                <p class="name">{filterOption}</p>
                <p class="value">100%</p>
              </div>
              <input type="range" value="100" min="0" max="200" />
            </div>
          </div>
          <div class="rotate">
            <label class="title">Rotate & Flip</label>
            <div class="options">
              <button onClick={() => rotateAndFlip("left")} id="left">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button onClick={() => rotateAndFlip("right")} id="right">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button
                onClick={() => rotateAndFlip("horizontal")}
                id="horizontal"
              >
                <i class="bx bx-reflect-vertical"></i>
              </button>
              <button onClick={() => rotateAndFlip("vertical")} id="vertical">
                <i class="bx bx-reflect-horizontal"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="preview-img">
          <img src="image-placeholder.svg" alt="preview-img" />
        </div>
      </div>
      <div class="controls">
        <button onClick={resetFilter} class="reset-filter">
          Reset Filters
        </button>
        <div class="row">
          <input
            onChange={loadImage}
            type="file"
            class="file-input"
            accept="image/*"
            hidden
          />
          <button onClick={handleChoose} class="choose-img">
            Choose Image
          </button>
          <button onClick={saveImage} class="save-img">
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
