import { useRef, useState } from 'react';
import { GoSearch } from 'react-icons/go';
import wideLogo from '../assets/imgs/wideLogo.png';
import { Link } from 'react-router-dom';

function Header() {
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
    const inputSearchRef = useRef<HTMLInputElement | null>(null);

    const handleSearchIconClick = () => {
        setIsInputVisible(true);
        if (inputSearchRef.current) {
            inputSearchRef.current.focus();
        }
    };

    const handleInputBlur = () => {
        setIsInputVisible(false);
    };

    return (
        <div
            className='py-[8px]'
            // style={{
            //     boxShadow: 'rgb(0 0 0 / 8%) 0px 3px 8px'
            // }}
        >
            <div className="md:container h-[48px] flex items-center justify-between mx-2">
                <Link to={'/'}>
                    <div className='flex items-center h-[40px] '>
                        <div className='h-[25px] w-[200px]'>
                            <img src={wideLogo} alt="" className='object-cover h-[30px]' />
                        </div>
                    </div>
                </Link>

                <div className='flex items-center'>

                    <div
                        className='mr-[5px] w-[40px] h-[40px] flex items-center justify-center hover:bg-gray_light cursor-pointer transition-all duration-300'
                        onClick={handleSearchIconClick}
                    >
                        <GoSearch />
                    </div>

                    <Link to={'/login'}>
                        <p className='rounded-full ml-[20px] hover:shadow-custom-blue text-sky_blue p-[10px] px-[15px]'>Đăng nhập/Đăng kí</p>
                    </Link>
                </div>
            </div>
            <div className='md:container '>
                {isInputVisible && (
                    <input
                        type="text"
                        ref={inputSearchRef}
                        onBlur={handleInputBlur} // Ẩn input khi mất focus
                        className=" w-[100%] mt-2 p-2 border border-gray z-10 outline-none"
                        placeholder="Tìm kiếm..."
                    />
                )}
            </div>

        </div>
    );
}

export default Header;
