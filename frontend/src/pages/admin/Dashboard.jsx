import { Card, CardContent } from "../../components/ui/Card"

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-6">Admin Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-purple-50 shadow-sm hover:shadow-md transition rounded-2xl">
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-purple-800">📚 Total Books</h2>
            <p className="text-3xl font-bold mt-2">1,245</p>
            <p className="text-sm text-gray-500">In library & store</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 shadow-sm hover:shadow-md transition rounded-2xl">
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-purple-800">👥 Users</h2>
            <p className="text-3xl font-bold mt-2">842</p>
            <p className="text-sm text-gray-500">Active members</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 shadow-sm hover:shadow-md transition rounded-2xl">
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-purple-800">📖 Borrowed</h2>
            <p className="text-3xl font-bold mt-2">320</p>
            <p className="text-sm text-gray-500">Currently borrowed books</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 shadow-sm hover:shadow-md transition rounded-2xl">
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-purple-800">💸 Sales</h2>
            <p className="text-3xl font-bold mt-2">$5,720</p>
            <p className="text-sm text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="bg-white shadow-sm hover:shadow-md transition rounded-2xl">
        <CardContent className="p-5">
          <h2 className="text-xl font-semibold text-purple-800 mb-3">📢 Announcements</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✍️ New book by Author A releasing next week.</li>
            <li>📚 Library system maintenance on Saturday.</li>
            <li>💡 Suggestion: Improve search filters.</li>
          </ul>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-purple-50 shadow-sm hover:shadow-md transition rounded-2xl">
        <CardContent className="p-5">
          <h2 className="text-xl font-semibold text-purple-800 mb-3">⚙️ System Health</h2>
          <p className="text-gray-700">
            ✅ All systems running smoothly. No issues detected in borrowing or purchasing
            modules. Database synced at 2:35 PM.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;