
function Card({ imageSrc, title, description, bgColor, textColor }) {
  return (
    <div
      className={`card outline-0.5 outline-gray-400 rounded-2xl w-105 h-40 flex items-center transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100  p-2 hover:cursor-context-menu hover:bg-${bgColor} shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] group`}
    >
      <img src={imageSrc} alt={title} className="w-30" />
      <div className="titles">
        <h3 className={`font-medium text-[24px] group-hover:text-white ${textColor}`}>{title}</h3>
        <p className="text-[#555] text-left  group-hover:text-white ">{description}</p>
      </div>
    </div>
  );
}



export default Card;
