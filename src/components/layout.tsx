import Nominatim from "@/components/nominatim";

import Header from "@/components/header";
interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Nominatim />
      <>{children}</>
    </>
  );
};
export default Layout;
