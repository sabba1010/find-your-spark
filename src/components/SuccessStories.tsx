import { useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import emmaDavid from "@/assets/emma-david.jpg";
import sarahMike from "@/assets/sarah-mike.jpg";
import jamesLily from "@/assets/james-lily.jpg";

const stories = [
    {
        name: "Emma & David",
        image: emmaDavid,
        quote: "Nous nous sommes trouvés sur Amour Et Sincerité et c'est un rêve devenu réalité depuis lors.",
        time: "Ensemble depuis 2 ans"
    },
    {
        name: "Sarah & Mike",
        image: sarahMike,
        quote: "L'algorithme de matching a vraiment fonctionné pour nous. Nous partagions tellement de centres d'intérêt dès le premier jour.",
        time: "Mariés l'été dernier"
    },
    {
        name: "James & Lily",
        image: jamesLily,
        quote: "Trouver quelqu'un qui vous comprend vraiment est difficile, mais cette plateforme l'a rendu possible.",
        time: "Fiancés"
    }
];

export default function SuccessStories() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, isPaused]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <section className="bg-muted/30 py-24 overflow-hidden">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl"
                    >
                        Histoires Réelles, <span className="text-primary">Amour Réel</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto max-w-2xl text-xl text-muted-foreground font-light"
                    >
                        Des milliers de personnes ont trouvé leur étincelle ici. Serez-vous le prochain ?
                    </motion.p>
                </div>

                <div className="relative mx-auto max-w-4xl"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="relative h-[550px] sm:h-[450px] w-full flex items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.4 },
                                    scale: { duration: 0.4 }
                                }}
                                className="absolute w-full h-full"
                            >
                                <div className="flex flex-col md:flex-row h-full overflow-hidden rounded-3xl bg-card shadow-2xl border border-border/50">
                                    <div className="relative h-64 md:h-full md:w-1/2 overflow-hidden">
                                        <img
                                            src={stories[currentIndex].image}
                                            alt={stories[currentIndex].name}
                                            className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-110"
                                        />
                                        <div className="absolute top-6 left-6 bg-primary text-white p-3 rounded-2xl shadow-lg ring-4 ring-white/10 backdrop-blur-sm">
                                            <Quote className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center p-8 md:p-12 md:w-1/2 bg-gradient-to-br from-card to-muted/20">
                                        <motion.p
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="mb-8 text-2xl font-medium italic text-foreground leading-relaxed"
                                        >
                                            "{stories[currentIndex].quote}"
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <h4 className="text-2xl font-black text-foreground">{stories[currentIndex].name}</h4>
                                            <p className="mt-1 text-primary font-bold tracking-wide flex items-center gap-2">
                                                <span className="h-1 w-6 bg-primary rounded-full"></span>
                                                {stories[currentIndex].time}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 lg:-left-20 z-20">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-2 bg-card/80 backdrop-blur shadow-xl hover:scale-110 transition-transform"
                            onClick={prevSlide}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 lg:-right-20 z-20">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-2 bg-card/80 backdrop-blur shadow-xl hover:scale-110 transition-transform"
                            onClick={nextSlide}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="mt-12 flex justify-center gap-3">
                        {stories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-10 bg-primary shadow-lg shadow-primary/30" : "w-2.5 bg-border hover:bg-muted-foreground"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
