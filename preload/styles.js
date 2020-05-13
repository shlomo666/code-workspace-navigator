const size = 100;
const padding = size / 4;
const radius = size / 2.5;
const gap = size / 10;
const border = size / 10;
const font = (size / 10) * 3;

exports.widthPerCell = size + padding * 2 + border * 2 + gap * 2;
exports.heightPerCell = size + padding * 2 + border * 2 + gap; // + gap for technical reasons

const backColor = (opacity) => `rgba(10, 10, 10, ${opacity})`;

const standard = `
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

exports.markedStyle = `
${standard}
background-color: ${backColor(1)};
color: white;
`;

exports.normalStyle = `
${standard}
background-color: ${backColor(0.5)};
color: rgb(220, 220, 220);
`;
