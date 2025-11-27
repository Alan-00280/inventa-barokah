
import { useEffect, useState } from "react";
import DialogCreateUser from "./CUD/CreateUser";

export default function MasterDataPengguna() {
  const [penggunaRole, setPenggunaRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/pengguna/with-role")
      .then((res) => res.json())
      .then((data) => {
        // flatten array agar ambil semua record
        const semuaPengguna = data.pengguna.flat();
        setPenggunaRole(semuaPengguna);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch gagal:", err);
        setError(JSON.stringify(err));
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Master Data</h1>
      <h2 className="text-xl font-semibold mb-6 text-gray-600">Pengguna</h2>

      {isLoading && <p className="text-gray-500">Loading . . .</p>}
      {error && <p className="text-red-500">{error}</p>}

      <DialogCreateUser f={{setLoading: setIsLoading, setErr: setError}}/>
      
      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b text-left">#</th>
                <th className="px-4 py-2 border-b text-left">ID</th>
                <th className="px-4 py-2 border-b text-left">Username</th>
                <th className="px-4 py-2 border-b text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {penggunaRole.map((user, index) => (
                <tr
                  key={user.iduser}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 border-b text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-700">
                    {user.iduser}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800 font-medium">
                    {user.username}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-700">
                    {user.nama_role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
