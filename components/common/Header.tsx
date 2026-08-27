"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass, Sparkles, Shield } from "lucide-react";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/#exhibition-hall", label: "EXHIBITION" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/about", label: "ABOUT" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/#exhibition-hall") return false;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-header shadow-subtle py-3.5"
          : "bg-surface/90 backdrop-blur-md border-b border-surface-border/60 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none"
          aria-label="GIFTED PROJECT EXHIBITION 홈으로 이동"
        >
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-sm">
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-navy uppercase group-hover:text-primary transition-colors">
              GIFTED PROJECT EXHIBITION
            </span>
            <span className="text-[10px] text-navy-400 tracking-tight -mt-0.5">
              영재 프로젝트 온라인 연구 전시관
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="메인 내비게이션">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wider transition-colors rounded-md ${
                  active
                    ? "text-primary bg-primary-light"
                    : "text-navy-600 hover:text-navy hover:bg-surface-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-4 w-px bg-surface-border mx-2" />

          {/* Random discovery direct button */}
          <Link
            href="/projects?discover=random"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-navy-700 hover:text-navy bg-white border border-surface-border rounded-md shadow-subtle hover:border-primary/40 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>랜덤 탐색</span>
          </Link>

          {/* Admin link */}
          <Link
            href="/admin"
            className="ml-1 p-1.5 text-navy-400 hover:text-navy-700 hover:bg-surface-muted rounded-md transition-colors"
            title="관리자 시스템"
            aria-label="관리자 시스템 바로가기"
          >
            <Shield className="w-3.5 h-3.5" />
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-navy-700 hover:bg-surface-muted focus:outline-none"
          aria-expanded={mobileMenuOpen}
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-surface-border px-4 pt-2 pb-6 space-y-2 animate-fade-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold tracking-wider rounded-lg ${
                isActive(link.href)
                  ? "text-primary bg-primary-light"
                  : "text-navy-700 hover:bg-surface-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-surface-border flex items-center justify-between">
            <Link
              href="/projects?discover=random"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-primary"
            >
              <Compass className="w-4 h-4" />
              <span>🎲 우연히 만나는 프로젝트</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-medium text-navy-400 hover:text-navy flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>관리자</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
