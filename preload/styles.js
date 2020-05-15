let size;
let padding;
let radius;
let gap;
let border;
let font;

exports.widthPerCell = 0;
exports.heightPerCell = 0;

function setAllVars() {
  padding = Math.floor(size / 4);
  radius = Math.floor(size / 2.5);
  gap = Math.floor(size / 10);
  border = Math.floor(size / 10);
  font = Math.floor((size / 10) * 3);
  exports.widthPerCell = size + padding * 2 + border * 2 + gap * 2;
  exports.heightPerCell = size + padding * 2 + border * 2 + gap; // + gap for technical reasons
}

exports.restoreOriginalSize = () => {
  size = 100;
  setAllVars();
};
exports.restoreOriginalSize();

exports.setWidthPerCell = (newWidthPerCell) => {
  const ratio = newWidthPerCell / exports.widthPerCell;
  size = Math.floor(size * ratio);
  setAllVars();
};

const backColor = (opacity) => `rgba(10, 10, 10, ${opacity})`;

const standard = () => `
margin: 0px ${gap}px;
padding: ${padding}px ${padding}px;
font-size: ${font}px;
min-width: ${size}px;
max-width: ${size}px;
min-height: ${size}px;
max-height: ${size}px;
height: fit-content;
border: ${border}px solid ${backColor(0.5)};
border-radius: ${radius}px;
text-align: center;
display: flex;
justify-content: center;
align-items: center;
`;

exports.markedStyle = () => `
${standard()}
background-color: ${backColor(1)};
color: white;
`;

exports.normalStyle = () => `
${standard()}
background-color: ${backColor(0.5)};
color: rgb(220, 220, 220);
`;
