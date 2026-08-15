import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { themeService } from '../../../core/services/theme.service';

interface Slide {
  id: number;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  mobileImage: string;
  ctaText: string;
  ctaTextAr: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaTextAr: string;
  secondaryCtaLink: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Discover Premium Lifestyle',
    titleAr: 'اكتشف نمط الحياة الفاخر',
    subtitle: '✨ New Collection 2026',
    subtitleAr: '✨ مجموعة جديدة 2026',
    description: 'Experience the epitome of luxury with our curated collection of premium products.',
    descriptionAr: 'استمتع بأرقى مستويات الفخامة مع مجموعتنا المختارة من المنتجات المتميزة.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ctaText: 'Shop Now',
    ctaTextAr: 'تسوق الآن',
    ctaLink: '/products',
    secondaryCtaText: 'View Collections',
    secondaryCtaTextAr: 'عرض المجموعات',
    secondaryCtaLink: '/categories',
    gradient: 'bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent'
  },
  {
    id: 2,
    title: 'Summer Sale Up to 40% Off',
    titleAr: 'خصومات الصيف تصل إلى 40%',
    subtitle: '🔥 Limited Time Offer',
    subtitleAr: '🔥 عرض لفترة محدودة',
    description: 'Amazing deals on premium fashion, electronics, and home decor.',
    descriptionAr: 'عروض مذهلة على الأزياء الفاخرة والإلكترونيات والديكور المنزلي.',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80',
    ctaText: 'Shop Sale',
    ctaTextAr: 'تسوق التخفيضات',
    ctaLink: '/products?filter=sale',
    secondaryCtaText: 'Learn More',
    secondaryCtaTextAr: 'اعرف المزيد',
    secondaryCtaLink: '/about',
    gradient: 'bg-gradient-to-r from-primary-900/80 via-primary-800/50 to-transparent'
  },
  {
    id: 3,
    title: 'Tech Innovation 2026',
    titleAr: 'تكنولوجيا مبتكرة 2026',
    subtitle: '🚀 Latest Gadgets',
    subtitleAr: '🚀 أحدث الأجهزة',
    description: 'Cutting-edge technology with our latest collection of smart devices.',
    descriptionAr: 'أحدث التقنيات مع مجموعتنا الجديدة من الأجهزة الذكية.',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80',
    ctaText: 'Explore Tech',
    ctaTextAr: 'استكشف التقنية',
    ctaLink: '/categories/1',
    secondaryCtaText: 'View Details',
    secondaryCtaTextAr: 'عرض التفاصيل',
    secondaryCtaLink: '/products',
    gradient: 'bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-transparent'
  },
  {
    id: 4,
    title: 'Elegant Timepieces',
    titleAr: 'ساعات أنيقة',
    subtitle: '⌚ Timeless Collection',
    subtitleAr: '⌚ مجموعة خالدة',
    description: 'Discover our exclusive collection of premium watches crafted with precision.',
    descriptionAr: 'اكتشف مجموعتنا الحصرية من الساعات الفاخرة المصنوعة بدقة.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1920&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    ctaText: 'View Watches',
    ctaTextAr: 'شاهد الساعات',
    ctaLink: '/products',
    secondaryCtaText: 'Explore',
    secondaryCtaTextAr: 'استكشف',
    secondaryCtaLink: '/categories',
    gradient: 'bg-gradient-to-r from-amber-900/80 via-amber-800/50 to-transparent'
  }
];

export function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const isTransitioningRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const currentSlideRef = useRef(currentSlide);
  currentSlideRef.current = currentSlide;
  const directionRef = useRef(direction);
  directionRef.current = direction;

  useEffect(() => {
    setDirection(themeService.getDirection());
    const unsubscribe = themeService.subscribe(() => {
      setDirection(themeService.getDirection());
    });
    return unsubscribe;
  }, []);

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartXRef.current - touchEndXRef.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (directionRef.current === 'ltr') {
        diff > 0 ? nextSlide() : previousSlide();
      } else {
        diff > 0 ? previousSlide() : nextSlide();
      }
    }
  };

  const nextSlide = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setCurrentSlide((current) => {
      const next = current === slides.length - 1 ? 0 : current + 1;
      return next;
    });

    resetAutoPlay();

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1000);
  };

  const previousSlide = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setCurrentSlide((current) => {
      const prev = current === 0 ? slides.length - 1 : current - 1;
      return prev;
    });

    resetAutoPlay();

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1000);
  };

  const goToSlide = (index: number) => {
    if (isTransitioningRef.current || index === currentSlideRef.current) return;
    isTransitioningRef.current = true;

    setCurrentSlide(index);
    resetAutoPlay();

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1000);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = window.setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  const getLocalizedText = (en: string, ar: string): string => {
    return directionRef.current === 'rtl' ? ar : en;
  };

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      touchStartXRef.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      touchEndXRef.current = event.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        directionRef.current === 'ltr' ? previousSlide() : nextSlide();
      } else if (event.key === 'ArrowRight') {
        directionRef.current === 'ltr' ? nextSlide() : previousSlide();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <div className="absolute inset-0 hidden md:block">
              <img
                src={slide.image}
                alt={getLocalizedText(slide.title, slide.titleAr)}
                className={`w-full h-full object-cover transition-all duration-[2s] ${
                  currentSlide === index ? 'scale-110' : 'scale-100'
                }`}
                loading="eager"
              />
            </div>

            <div className="absolute inset-0 md:hidden">
              <img
                src={slide.mobileImage || slide.image}
                alt={getLocalizedText(slide.title, slide.titleAr)}
                className={`w-full h-full object-cover transition-all duration-[2s] ${
                  currentSlide === index ? 'scale-110' : 'scale-100'
                }`}
                loading="eager"
              />
            </div>

            <div className={`absolute inset-0 transition-opacity duration-1000 ${slide.gradient}`}></div>

            <div className="relative h-full">
              <div className={`absolute inset-0 flex items-center ${direction === 'ltr' ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${direction === 'ltr' ? 'text-left' : 'text-right'}`}>
                  <div className={`max-w-2xl ${direction === 'ltr' ? 'ml-0 mr-auto' : 'mr-0 ml-auto'}`}>
                    <div
                      className={`space-y-4 sm:space-y-6 md:space-y-8 transition-all duration-800 ${
                        currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                      }`}
                      style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <div className="inline-block">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white text-xs sm:text-sm font-medium border border-white/20 shadow-lg">
                          <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
                          {getLocalizedText(slide.subtitle, slide.subtitleAr)}
                        </span>
                      </div>

                      <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight md:leading-tight lg:leading-tight ${direction === 'ltr' ? 'text-left' : 'text-right'}`}>
                        {getLocalizedText(slide.title, slide.titleAr)}
                      </h1>

                      <p className={`text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg ${direction === 'ltr' ? 'text-left mr-auto' : 'text-right ml-auto'}`}>
                        {getLocalizedText(slide.description, slide.descriptionAr)}
                      </p>

                      <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 ${direction === 'ltr' ? 'justify-start' : 'justify-end'}`}>
                        <Link
                          to={slide.ctaLink}
                          className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 text-sm sm:text-base"
                          style={{ flexDirection: direction === 'ltr' ? 'row' : 'row-reverse' }}
                        >
                          <span>{getLocalizedText(slide.ctaText, slide.ctaTextAr)}</span>
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${direction === 'ltr' ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={direction === 'ltr' ? 'M17 8l4 4m0 0l-4 4m4-4H3' : 'M7 8l-4 4m0 0l4 4m-4-4h14'}
                            />
                          </svg>
                        </Link>

                        <Link
                          to={slide.secondaryCtaLink}
                          className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                          style={{ flexDirection: direction === 'ltr' ? 'row' : 'row-reverse' }}
                        >
                          <span>{getLocalizedText(slide.secondaryCtaText, slide.secondaryCtaTextAr)}</span>
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${direction === 'ltr' ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={direction === 'ltr' ? 'M17 8l4 4m0 0l-4 4m4-4H3' : 'M7 8l-4 4m0 0l4 4m-4-4h14'}
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={previousSlide}
        className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/20 hover:scale-110 shadow-lg ${direction === 'ltr' ? 'left-3 sm:left-6 md:left-8' : 'right-3 sm:right-6 md:right-8'}`}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={direction === 'ltr' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/20 hover:scale-110 shadow-lg ${direction === 'ltr' ? 'right-3 sm:right-6 md:right-8' : 'left-3 sm:left-6 md:left-8'}`}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={direction === 'ltr' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
        </svg>
      </button>

      <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 z-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className="flex-1 h-1 sm:h-1.5 rounded-full transition-all duration-300 overflow-hidden"
              >
                {index === currentSlide && (
                  <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-[progress_5s_linear]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between md:hidden">
            <div className="flex gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/70 text-xs font-medium">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="w-6 h-10 sm:w-8 sm:h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5 sm:p-2">
          <div className="w-1.5 h-2 sm:h-3 bg-white/50 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="absolute top-20 right-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}
