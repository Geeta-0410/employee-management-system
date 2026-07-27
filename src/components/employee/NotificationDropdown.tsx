import {
  FaBell,
} from "react-icons/fa";

interface Props {
  notifications: string[];
}

function NotificationDropdown({
  notifications,
}: Props) {
  return (
    <div
      className="
      absolute
      right-0
      top-12
      w-80
      bg-white
      rounded-2xl
      shadow-2xl
      border
      z-50
      overflow-hidden
    "
    >
      <div className="p-4 border-b">

        <h3 className="font-bold text-lg flex items-center gap-2">
          <FaBell />
          Notifications
        </h3>

      </div>

      <div className="max-h-80 overflow-y-auto">

        {notifications.length > 0 ? (

          notifications.map(
            (note, index) => (
              <div
                key={index}
                className="
                px-4
                py-3
                border-b
                hover:bg-slate-50
                transition
                cursor-pointer
              "
              >
                {note}
              </div>
            )
          )

        ) : (

          <p className="p-4 text-slate-500">
            No Notifications
          </p>

        )}

      </div>

      <div className="p-3 text-center bg-slate-50">

        <button
          className="
          text-blue-600
          font-medium
          hover:text-blue-800
        "
        >
          View All
        </button>

      </div>

    </div>
  );
}

export default NotificationDropdown;