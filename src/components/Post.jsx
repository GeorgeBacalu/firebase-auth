import { useState } from "react";

export default function Post({ id, danceSchool, email, instructors, location, mobile, danceStyles, imageUrl, timeStamp }) {
  const [showAllDanceStyles, setShowAllDanceStyles] = useState(false);

  const cardStyles = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const firstThreeDanceStyle = danceStyles.slice(0, 3);
  const remainingStylesCount = Math.max(0, danceStyles.length - 3);

  // const timeDifference = Date.now() - new Date(timeStamp).getTime();

  // const dateParts = timeStamp.toString().split(" ");
  // const dateString = dateParts.slice(0, 3).join(" ");
  // const timeString = dateParts.slice(4).join(" ");
  // const dateTime = dateString + timeString;
  // const postDate = new Date(dateTime);
  // const timeDifference = Date.now() - postDate.getTime();

  // const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  return (
    <li className="bg-white shadow-md rounded-md p-6 my-4 w-full md:w-1/2" style={cardStyles}>
      <div className="bg-black bg-opacity-50 rounded-md p-4">
        <h2 className="text-white text-xl font-semibold mb-2">{danceSchool}</h2>
        {/* <span className="text-white text-sm mb-2">{daysPassed} days ago</span> */}
        <p className="text-white mb-2">Email: {email}</p>
        <p className="text-white mb-2">Instructors:
          <span className="ml-4">
            {instructors.map((instructor, index) => <button key={index} className="bg-white text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">{instructor}</button>)}
          </span>
        </p>
        <p className="text-white mb-2">Mobile: {mobile}</p>
        <p className="text-white mb-2">Location: {location}</p>
        <div className="flex flex-wrap">
          {showAllDanceStyles ? (
            <>
              {danceStyles.map((danceStyle, index) =>
                <span key={index} className="bg-white text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">{danceStyle}</span>)}
              <button onClick={() => setShowAllDanceStyles(false)} className="bg-white text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">Show less</button>
            </>
          ) : (
            <>
              {firstThreeDanceStyle.map((danceStyle, index) =>
                <span key={index} className="bg-white text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">{danceStyle}</span>)}
              {remainingStylesCount > 0 && <button onClick={() => setShowAllDanceStyles(true)} className="bg-white text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">+{remainingStylesCount} more</button>}
            </>
          )}
        </div>
      </div>
    </li>
  )
}