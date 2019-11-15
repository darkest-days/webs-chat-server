const adjectives = ["Funny","Sad","Happy","Fast","Slow"];
const colors = ["Black","Blue","Gray","Green","Orange","Pink","Red","Yellow",];
const animals = ["Elephant", "Wolf","Lion","Cat","Monkey","Sloth","Cheetah"];


const getNameString = () =>{
    const adj = adjectives[Math.floor(Math.random()*adjectives.length)];
    const col = colors[Math.floor(Math.random()*colors.length)];
    const ani = animals[Math.floor(Math.random()*animals.length)];
    return adj+col+ani;
};

const getNameObject = () =>{
    const adj = adjectives[Math.floor(Math.random()*adjectives.length)];
    const col = colors[Math.floor(Math.random()*colors.length)];
    const ani = animals[Math.floor(Math.random()*animals.length)];
    return {name:adj+col+ani,color:col};
};

exports.getNameObject = getNameObject;