import { ReactNode } from "react";

interface ShowProps {
  children: ReactNode;
  when: boolean;
  fallback: ReactNode;
}

const Show = ({ children, when, fallback }: ShowProps) => {
  return <>{when ? children : fallback}</>;
};

export default Show;
