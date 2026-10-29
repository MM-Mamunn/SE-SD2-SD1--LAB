import { useState, useEffect } from "react";

export default function RealLifeApi() {

  // ── State for Top Contributors ─────────────────────────────
  const [contributors, setContributors] = useState([]);
  const [contributorsLoading, setContributorsLoading] = useState(true);
  const [contributorsError, setContributorsError] = useState(null);

  // ── State for Teachers ─────────────────────────────────────
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState(null);

  // ── First useEffect: fetch Top Contributors ────────────────
  useEffect(() => {
    async function fetchContributors() {
      try {
        const response = await fetch(
          "https://iiuc-resources-management-api.vercel.app/api/info/topcontributor"
        );
        const data = await response.json();
        setContributors(data.rows);
      } catch (err) {
        setContributorsError("Failed to load contributors.");
      } finally {
        setContributorsLoading(false);
      }
    }

    fetchContributors();
  }, []); // runs once when the component mounts

  // ── Second useEffect: fetch Teachers ──────────────────────
  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await fetch(
          "https://iiuc-resources-management-api.vercel.app/api/info/teacher"
        );
        const data = await response.json();
        setTeachers(data.rows);
      } catch (err) {
        setTeachersError("Failed to load teachers.");
      } finally {
        setTeachersLoading(false);
      }
    }

    fetchTeachers();
  }, []); // runs once when the component mounts

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Real Life API Example
      </h1>

      {/* ── Section 1: Top Contributors ── */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Top Contributors
        </h2>

        {contributorsLoading && (
          <p className="text-gray-500">Loading contributors...</p>
        )}

        {contributorsError && (
          <p className="text-red-500">{contributorsError}</p>
        )}

        {!contributorsLoading && !contributorsError && (
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
        )}
      </section>

      {/* ── Section 2: Teachers ── */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Teachers
        </h2>

        {teachersLoading && (
          <p className="text-gray-500">Loading teachers...</p>
        )}

        {teachersError && (
          <p className="text-red-500">{teachersError}</p>
        )}

        {!teachersLoading && !teachersError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.code}
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
        )}
      </section>

    </div>
  );
}
