import { User, Settings } from "lucide-react";

export default function StudentProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-500">Manage your personal information and career preferences.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <Settings size={16} /> Edit Settings
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-[#1a2e4a] to-[#097969]"></div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                <User size={48} />
              </div>
            </div>
          </div>
          
          <div className="mt-16 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Student User</h3>
              <p className="text-sm text-gray-500">student@casec.run.edu.ng</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</p>
                <p className="text-sm text-gray-700 mt-1">Computer Science</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expected Graduation</p>
                <p className="text-sm text-gray-700 mt-1">2027</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Information</h3>
        <p className="text-gray-400 text-sm italic">User profile details and career track settings will appear here in the next update.</p>
      </div>
    </div>
  );
}
