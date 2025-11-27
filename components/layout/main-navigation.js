"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

function useNavItem(matchPath) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(matchPath(router.pathname));
  }, [router.pathname, matchPath]);

  return { isActive };
}

function NavItem({
  href,
  label,
  widthClass,
  borderZ,
  navState,
  animateVar,
  hoverVar,
  children,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const baseWidth = `var(${animateVar})`;
  const hoverWidth = `var(${hoverVar})`;

  const activeOrHover = navState.isActive || isHovered;

  return (
    <div
      className="mx-1 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href || "#"} className="block relative">
        <motion.div
          className="flex flex-row items-end px-6 sm:px-10 py-3 rounded-2xl bg-page1 shadow-[0px_1px_4px_rgba(56,52,52,0.3),_0px_2px_8px_rgba(56,52,52,0.3)]"
          animate={{ y: activeOrHover ? -2 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            initial={{ width: baseWidth }}
            animate={{ width: activeOrHover ? hoverWidth : baseWidth }}
            className={`sm:border-b-[0.2em] border-b-[0.18em] border-pageMenu rounded-sm ${borderZ} ${widthClass}`}
          >
            <div className="flex flex-row p-0 items-end gap-1">
              {children}

              <motion.span
                initial={false}
                animate={{
                  opacity: activeOrHover ? 1 : 0,
                  y: activeOrHover ? 0 : 8,
                }}
                transition={{
                  type: "spring",
                  duration: 0.25,
                  stiffness: 260,
                }}
                className="flex items-end justify-center whitespace-nowrap sm:text-[1em] text-[0.7em] font-extrabold text-black"
              >
                {label}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </div>
  );
}

const HomePageIcon = ({ hover }) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="none"
      viewBox="0 0 24 24"
      className="w-7 h-7 sm:w-9 sm:h-9"
    >
      <motion.path
        initial={{ pathLength: 1 }}
        animate={{ pathLength: hover ? [0, 1] : 1 }}
        transition={{ duration: 1 }}
        stroke="#1E1B13"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M2 20h2m0 0h6m-6 0v-8.548c0-.534 0-.801.065-1.05a2 2 0 0 1 .28-.617c.145-.213.346-.39.748-.741l4.801-4.202c.746-.652 1.119-.978 1.538-1.102.37-.11.765-.11 1.135 0 .42.124.794.45 1.54 1.104l4.8 4.2c.402.352.603.528.748.74q.192.287.28.618c.065.249.065.516.065 1.05V20m-10 0h4m-4 0v-4a2 2 0 1 1 4 0v4m0 0h6m0 0h2"
      />
    </svg>
  </div>
);

const TheoryPageIcon = ({ hover }) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="none"
      viewBox="0 0 24 24"
      className="w-7 h-7 sm:w-9 sm:h-9"
    >
      <motion.path
        initial={{ pathLength: 1 }}
        animate={{ pathLength: hover ? [0, 1] : 1 }}
        transition={{ duration: 2 }}
        stroke="#1E1B13"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.92"
        d="M4 19V6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C5.52 3 6.08 3 7.2 3h9.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C20 4.52 20 5.08 20 6.2V17H6a2 2 0 0 0-2 2m0 0a2 2 0 0 0 2 2h14M9 7h6m-6 4h6m4 6v4"
      />
    </svg>
  </div>
);

function MainNavigation() {
  const home = useNavItem((p) => p === "/");
  const theory = useNavItem((p) => p === "/wyniki");

  return (
    <div className="w-full h-[5.5rem] relative bg-page3 overflow-hidden">
      <div className="absolute z-10 font-typewriter flex items-center justify-center w-full my-4">
        <div className="flex flex-row items-center justify-center gap-10">
          <NavItem
            href="/"
            label="Strona Główna"
            widthClass="relative sm:[--scale-hover-1:10.6rem] sm:[--scale-animate-1:2.25rem] [--scale-hover-1:7.5rem] [--scale-animate-1:1.8rem]"
            borderZ="z-10"
            navState={home}
            animateVar="--scale-animate-1"
            hoverVar="--scale-hover-1"
          >
            <HomePageIcon />
          </NavItem>

          <NavItem
            href="/wyniki"
            label="Wyniki"
            widthClass="sm:[--scale-hover-2:6.4rem] sm:[--scale-animate-2:2.25rem] [--scale-hover-2:4.5rem] [--scale-animate-2:1.8rem]"
            borderZ="z-10"
            navState={theory}
            animateVar="--scale-animate-2"
            hoverVar="--scale-hover-2"
          >
            <TheoryPageIcon />
          </NavItem>
        </div>
      </div>
    </div>
  );
}

export default MainNavigation;
