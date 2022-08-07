import { useEffect, useState } from "react";
import "./App.css";
import defaultImage from './image-placeholder.svg'

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
  const [values, setValues] = useState({
    brightness: "100",
    saturation: "100",
    inversion: "0",
    grayscale: "0",
    rotate: 0,
    flipHorizontal: 1,
    flipVertical: 1,
  });
  const [filterValue, setFilterValue] = useState(values.brightness);
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
  }, [values]);

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

  // const applyFilter = () => {
  console.log(property);
  const transform = `rotate(${values.rotate}deg) scale(${values.flipHorizontal}, ${values.flipVertical})`;
  const filter = `brightness(${values.brightness}%) saturate(${values.saturation}%) invert(${values.inversion}%) grayscale(${values.grayscale}%)`;
  // };

  const updateFilter = () => {
    property.filterValue.innerText = `${property.filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
      setValues({ ...values, brightness: property.filterSlider.value });
    } else if (selectedFilter.id === "saturation") {
      setValues({ ...values, saturation: property.filterSlider.value });
    } else if (selectedFilter.id === "inversion") {
      setValues({ ...values, inversion: property.filterSlider.value });
    } else {
      setValues({ ...values, grayscale: property.filterSlider.value });
    }
    // applyFilter();
  };

  const resetFilter = () => {
    setValues({
      brightness: "100",
      saturation: "100",
      inversion: "0",
      grayscale: "0",
      rotate: 0,
      flipHorizontal: 1,
      flipVertical: 1,
    });
    property.filterOptions[0].click();
    // applyFilter();
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = property.previewImg.naturalWidth;
    canvas.height = property.previewImg.naturalHeight;

    ctx.filter = `brightness(${values.brightness}%) saturate(${values.saturation}%) invert(${values.inversion}%) grayscale(${values.grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (values.rotate !== 0) {
      ctx.rotate((values.rotate * Math.PI) / 180);
    }
    ctx.scale(values.flipHorizontal, values.flipVertical);
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
      setValues((values) => ({ ...values, rotate: values.rotate - 90 }));
    } else if (option === "right") {
      setValues({ ...values, rotate: values.rotate + 90 });
    } else if (option === "horizontal") {
      setValues({
        ...values,
        flipHorizontal: values.flipHorizontal === 1 ? -1 : 1,
      });
    } else {
      setValues({
        ...values,
        flipVertical: values.flipVertical === 1 ? -1 : 1,
      });
    }
  };

  const selectFilterOption = (filterOption) => {
    setFilterOption(filterOption);
    if (filterOption === "brightness") {
      setFilterValue(values.brightness);
    } else if (filterOption === "saturation") {
      setFilterValue(values.saturation);
    } else if (filterOption === "inversion") {
      setFilterValue(values.inversion);
    } else {
      setFilterValue(values.grayscale);
    }
    console.log(filterValue)
  };

  const updateFilterValue = (event) => {
    console.log(event.target.value);
    setFilterValue(event.target.value);
    if (filterOption === "brightness") {
      setValues((values) => ({ ...values, brightness: event.target.value }));
    } else if (filterOption === "saturation") {
      setValues((values) => ({ ...values, saturation: event.target.value }));
    } else if (filterOption === "inversion") {
      setValues((values) => ({ ...values, inversion: event.target.value }));
    } else {
      setValues((values) => ({ ...values, grayscale: event.target.value }));
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
                <p class="value">{filterValue}%</p>
              </div>
              <input
                onChange={(event) => updateFilterValue(event)}
                type="range"
                value={filterValue}
                min="0"
                max="200"
              />
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
          <img
            style={{ transform: transform, filter: filter }}
            src={defaultImage}
            alt="preview-img"
          />
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
