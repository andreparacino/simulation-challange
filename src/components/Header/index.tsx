import logo from "@/assets/svg/logo.svg";

const Header = () => {
  return (
    <header className="flex w-screen items-center justify-between bg-black px-8 py-4">
      <img className="w-8" src={logo} alt="" />
      <nav>
        <div className="w-full " id="navbar-default">
          <ul className="flex flex-row gap-6 rounded-lg font-bold">
            <li>
              <a href="#" className="rounded text-gray-300 hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="rounded text-gray-300 hover:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="rounded text-gray-300 hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
