import { createRef, useState } from "react";
import "./App.css";
import defaultImage from "./image-placeholder.svg";
import NavBar from './NavBar/NavBar'
function App() {
  const [values, setValues] = useState({
    brightness: "100",
    saturation: "100",
    inversion: "0",
    grayscale: "0",
    rotate: 0,
    flipHorizontal: 1,
    flipVertical: 1,
  });
  const [image, setImage] = useState("");
  const [filterOption, setFilterOption] = useState("brightness");
  const filterValue = values[filterOption];
  const myRef = createRef();

  const inputClick = () => {
    myRef.current.click();
  };

  const loadImage = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const transform = `rotate(${values.rotate}deg) scale(${values.flipHorizontal}, ${values.flipVertical})`;
  const filter = `brightness(${values.brightness}%) saturate(${values.saturation}%) invert(${values.inversion}%) grayscale(${values.grayscale}%)`;

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
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const downloadImage = document.querySelector(".preview-img img");
    canvas.width = downloadImage.naturalWidth;
    canvas.height = downloadImage.naturalHeight;

    ctx.filter = `brightness(${values.brightness}%) saturate(${values.saturation}%) invert(${values.inversion}%) grayscale(${values.grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (values.rotate !== 0) {
      ctx.rotate((values.rotate * Math.PI) / 180);
    }
    ctx.scale(values.flipHorizontal, values.flipVertical);
    ctx.drawImage(
      downloadImage,
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
  };

  const updateFilterValue = (event) => {
    console.log(event.target.value);
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
    <>
    <NavBar />
      <div className="container">
        <div className="wrapper">
          <div className="editor-panel">
            <div className="filter">
              <label className="title">Filters</label>
              <div className="options">
                <button
                  onClick={() => selectFilterOption("brightness")}
                  id="brightness"
                  className={filterOption === "brightness" && "active"}
                >
                  Brightness
                </button>
                <button
                  onClick={() => selectFilterOption("saturation")}
                  id="saturation"
                  className={filterOption === "saturation" && "active"}
                >
                  Saturation
                </button>
                <button
                  onClick={() => selectFilterOption("inversion")}
                  id="inversion"
                  className={filterOption === "inversion" && "active"}
                >
                  Inversion
                </button>
                <button
                  onClick={() => selectFilterOption("grayscale")}
                  id="grayscale"
                  className={filterOption === "grayscale" && "active"}
                >
                  Grayscale
                </button>
              </div>
              <div className="slider">
                <div className="filter-info">
                  <p className="name">{filterOption}</p>
                  <p className="value">{filterValue}%</p>
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
            <div className="rotate">
              <label className="title">Rotate & Flip</label>
              <div className="options">
                <button onClick={() => rotateAndFlip("left")} id="left">
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
                <button onClick={() => rotateAndFlip("right")} id="right">
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
                <button
                  onClick={() => rotateAndFlip("horizontal")}
                  id="horizontal"
                >
                  <i className="bx bx-reflect-vertical"></i>
                </button>
                <button onClick={() => rotateAndFlip("vertical")} id="vertical">
                  <i className="bx bx-reflect-horizontal"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="preview-img">
            <img
              style={{ transform: transform, filter: filter }}
              src={image ? image : defaultImage}
              alt="preview-img"
            />
          </div>
        </div>
        <div className="controls">
          <button onClick={resetFilter} className="reset-filter">
            Reset Filters
          </button>
          <div className="row">
            <input
              onChange={loadImage}
              type="file"
              ref={myRef}
              className="file-input"
              accept="image/*"
              hidden
            />
            <button onClick={inputClick} className="choose-img">
            Select Image
            </button>
            <button onClick={saveImage} className="save-img">
              Save Image
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
