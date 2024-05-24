import React from "react";

export const Container: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden w-[878px] max-w-full min-h-[600px]">
    {children}
  </div>
);

interface SignInProps {
  signinIn: boolean;
}

export const SignUpContainer: React.FC<React.PropsWithChildren<SignInProps>> = ({ signinIn, children }) => (
  <div
    className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 opacity-0 z-10 ${
      !signinIn ? "translate-x-full opacity-100 z-50" : ""
    }`}
  >
    {children}
  </div>
);

export const SignInContainer: React.FC<React.PropsWithChildren<SignInProps>> = ({ signinIn, children }) => (
  <div
    className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 ${
      !signinIn ? "translate-x-full" : ""
    }`}
  >
    {children}
  </div>
);

export const Form: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <form className="bg-white flex items-center justify-center flex-col p-12 h-full text-center">
    {children}
  </form>
);

export const Title: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <h1 className="font-bold m-0">{children}</h1>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="bg-gray-200 border-none p-3 m-2 w-full text-black"
    {...props}
  />
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button className="rounded-[20px] border border-[#fc4a1a] bg-[#fc4a1a] text-white text-[12px] font-bold py-3 px-11 tracking-wide uppercase transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none">
    {children}
  </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button 
    className="rounded-[20px] border border-white bg-transparent text-white text-[12px] font-bold py-3 px-11 tracking-wide uppercase transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none"
    {...props}>
    {children}
  </button>
);

export const Anchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a className="text-gray-800 text-sm no-underline m-4" {...props} />
);

export const Anchor1: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a className="text-white text-sm no-underline m-4" {...props} />
);

export const OverlayContainer: React.FC<React.PropsWithChildren<SignInProps>> = ({ signinIn, children }) => (
  <div
    className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 ${
      !signinIn ? "transform -translate-x-full" : ""
    }`}
  >
    {children}
  </div>
);

export const Overlay: React.FC<React.PropsWithChildren<SignInProps>> = ({ signinIn, children }) => (
  <div
    className={`bg-gradient-to-r from-red-600 to-yellow-400 bg-no-repeat bg-cover bg-center text-white absolute left-[-100%] h-full w-[200%] transition-transform duration-600 ease-in-out ${
      !signinIn ? "transform translate-x-1/2" : ""
    }`}
  >
    {children}
  </div>
);

interface OverlayPanelProps {
  className?: string;
}

export const OverlayPanel: React.FC<React.PropsWithChildren<OverlayPanelProps>> = ({ className, children }) => (
  <div className={`absolute flex items-center justify-center flex-col p-12 text-center top-0 h-full w-1/2 transition-transform duration-600 ease-in-out ${className}`}>
    {children}
  </div>
);

export const LeftOverlayPanel: React.FC<React.PropsWithChildren<SignInProps>> = ({ signinIn, children }) => (
  <OverlayPanel
    className={`transform -translate-x-1/5 ${
      !signinIn ? "transform translate-x-0" : ""
    }`}
  >
    {children}
  </OverlayPanel>
);

export const RightOverlayPanel: React.FC<React.PropsWithChildren<SignInProps>> = ({ signinIn, children }) => (
  <OverlayPanel
    className={`right-0 transform translate-x-0 ${
      !signinIn ? "transform translate-x-1/5" : ""
    }`}
  >
    {children}
  </OverlayPanel>
);

export const Paragraph: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <p className="text-sm font-light leading-5 tracking-wider m-5">
    {children}
  </p>
);
