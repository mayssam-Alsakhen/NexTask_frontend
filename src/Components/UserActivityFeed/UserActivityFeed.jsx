"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegClock } from "react-icons/fa";

export default function UserActivityCard({ userId }) {
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/users/${userId}/activities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setActivities(res.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const displayActivities = showAll ? activities : activities.slice(0, 3);
// w-[500px]
  return (
    <div className="bg-white/60 rounded-lg shadow-md p-6 flex flex-col h-80">
      <h3 className="text-xl font-semibold mb-8">Recent Activity</h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : (
        <>
          <div className="flex-1 relative overflow-y-auto pr-2">
            <div className="relative">
              {/* Timeline line that spans full content */}
              <div className="absolute left-2 top-0 bottom-0 w-1 bg-[#b1c9ef]" />

              {displayActivities.map((activity, index) => {
                const date = new Date(activity.created_at);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 transition group relative"
                  >
                    {/* Timeline bubble */}
                    <div className="w-5 h-5 mt-1 rounded-full bg-[#8aaee0] flex justify-center items-center absolute left-0 top-0 translate-y-4">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>

                    <div className="flex-1 ml-8">
                      <p className="text-sm text-gray-700">{activity.message}</p>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <FaRegClock className="text-gray-400" />
                        <span>{formattedDate}</span>
                        <span>{formattedTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Show more/less toggle */}
          {activities.length > 3 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full text-center text-blue-500 hover:underline mt-2"
            >
              {showAll ? "Show less ↑" : `See all (${activities.length}) →`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
