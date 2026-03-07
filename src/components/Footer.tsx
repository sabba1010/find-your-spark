import { Link } from "react-router-dom";
import { Heart, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-card pb-12 pt-16">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid gap-12 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                                <Heart className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-foreground">
                                Heartbeat<span className="text-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground">
                            Helping you find meaningful connections and real love in the digital age.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link to="/discover" className="text-muted-foreground hover:text-primary transition-colors">Discover</Link></li>
                            <li><Link to="/match-setup" className="text-muted-foreground hover:text-primary transition-colors">Matches</Link></li>
                            <li><Link to="/messages" className="text-muted-foreground hover:text-primary transition-colors">Messages</Link></li>
                            <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Get Started</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">About us</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Our Story</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety Tips</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Community Guidelines</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>© {currentYear} Find Your Spark. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
