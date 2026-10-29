import { useState, useEffect } from "react";

export default function RealLifeApi() {
  // State for top contributors
  const [contributors, setContributors] = useState([]);
  // State for teachers
  const [teachers, setTeachers] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect runs once when the component first loads (empty dependency array [])
  useEffect(() => {
    async function fetchData() {
      try {
        // Call both APIs at the same time using Promise.all
        const [contributorsRes, teachersRes] = await Promise.all([
          fetch("https://iiuc-resources-management-api.vercel.app/api/info/topcontributor"),
          fetch("https://iiuc-resources-management-api.vercel.app/api/info/teacher"),
        ]);

        // Convert each response to JSON
        const contributorsData = await contributorsRes.json();
        const teachersData = await teachersRes.json();

        // Save the arrays into state
        setContributors(contributorsData.rows);
        setTeachers(teachersData.rows);
      } catch (err) {
        // If anything goes wrong, save the error message
        setError("Failed to fetch data. Please try again later.");
      } finally {
        // Always turn off the loading spinner when done
        setLoading(false);
      }
    }

    fetchData();
  }, []); // [] means: only run once, when the component mounts

  // -- Loading state --
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 text-lg">
        Loading data from APIs...
      </div>
    );
  }

  // -- Error state --
  if (error) {
    return (
      <div className="p-8 text-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  // -- Normal render --
  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Real Life API Example
      </h1>

      {/* Section 1: Top Contributors */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Top Contributors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="flex items-center gap-4 border rounded-lg p-4 bg-white shadow-sm"
            >
              {/* Profile picture */}
              <img
                src={contributor.profilePic}
                alt={contributor.name}
                className="w-16 h-16 rounded-full object-cover border"
              />

              {/* Contributor details */}
              <div>
                <p className="font-bold text-gray-800">{contributor.name}</p>
                <p className="text-sm text-gray-500">ID: {contributor.id}</p>
                <p className="text-sm text-gray-600">
                  Points: <span className="font-semibold">{contributor.point}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Resources: <span className="font-semibold">{contributor.resourceCount}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Teachers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Teachers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teachers.map((teacher, index) => (
            // teacher.code can be empty (""), so we fall back to the index as key
            <div
              key={teacher.code || index}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-bold text-gray-800 mb-1">{teacher.name}</p>
              <p className="text-sm text-gray-600">{teacher.desig}</p>
              <p className="text-sm text-gray-600">
                Phone: {teacher.phone || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Email: {teacher.email || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Code: {teacher.code || "---"}
              </p>
              <p className="text-sm text-gray-500">
                Type: {teacher.type || "---"}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
