import React from "react";

const Footer = () => {

  return (
    <footer className="bg-black text-white text-center p-6 gap-2 flex flex-col ">
      <p className="flex justify-center gap-6">
        <span>Conditions of use and Sale</span>
        <span>Privacy Notice</span>
        <span>
          Contact us:{" "}
          <a href="mailto:demo.user@gmail.com" className="underline">
            demo.user@gmail.com
          </a>
        </span>
      </p>
      <p>&copy; 2003-2025, Qshop.com Inc. or its affiliate</p>
    </footer>
  );
};

export default Footer;
