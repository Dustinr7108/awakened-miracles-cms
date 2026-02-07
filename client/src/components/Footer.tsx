import { Clover, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Clover className="h-6 w-6" />
              <span className="font-serif font-bold text-xl">Spiritual Academy</span>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              Transforming lives through comprehensive spiritual counseling education. 
              Join thousands of students on their journey to deeper wisdom and healing.
            </p>
            <p className="text-background/60 text-sm mb-6">
              Co-Founders: <strong className="text-background/80">Katherine Kenedi</strong> & <strong className="text-background/80">Rochelle "Shelley" Stockwell-Nicholas</strong><br />
              CEO: <strong className="text-background/80">Dustin Read</strong>
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Courses</h3>
            <ul className="space-y-2 text-background/80">
              <li><Link href="/courses" className="hover:text-background transition-colors">All Courses</Link></li>
              <li><a href="#" className="hover:text-background transition-colors">Beginner Level</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Advanced Training</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Certification</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8">
          <div className="text-center text-background/60 space-y-2">
            <p>© {new Date().getFullYear()} Awakened Miracles. All rights reserved.</p>
            <p className="text-sm">
              All content is copyrighted by <strong className="text-background/80">Katherine Kenedi</strong> and <strong className="text-background/80">Rochelle "Shelley" Stockwell-Nicholas</strong>
            </p>
            <p className="text-xs">
              US Copyright Registration PA 2-355-489 | Unauthorized reproduction or distribution of any course materials, videos, or content is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
