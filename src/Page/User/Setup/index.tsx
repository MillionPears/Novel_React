// UserSetup.tsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function UserSetup() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
      <div className="mx-10 mt-2 flex justify-center">
        <div className="w-[45vw] relative">
          {/* setting option */}
          <ul className="fixed top-40 transform translate-x-[-220%] rounded-md">
            <li
              className={`hover:text-sky_blue_light px-5 py-2 ${currentPath.includes('account')
                  ? 'text-gray font-bold border-l-4 border-sky_blue_light pl-2'
                  : 'text-gray-500'
                }`}
            >
              <Link to="/user/account">Tài khoản</Link>
            </li>
            <li
              className={`hover:text-sky_blue_light px-5 py-2 ${currentPath.includes('bookmark')
                  ? 'text-gray font-bold border-l-4 border-sky_blue_light pl-2'
                  : 'text-gray-500'
                }`}
            >
              <Link to="/user/bookmark">Truyện đánh dấu</Link>
            </li>
            <li
              className={`hover:text-sky_blue_light px-5 py-2 ${currentPath.includes('follow')
                  ? 'text-gray font-bold border-l-4 border-sky_blue_light pl-2'
                  : 'text-gray-500'
                }`}
            >
              <Link to="/user/follow">Truyện theo dõi</Link>
            </li>
          </ul>

          {/* form setting account */}

        </div>

      </div>
      <div className=''>
        <Outlet />
      </div>
    </div>
  );
}

export default UserSetup;
