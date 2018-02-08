$(document).ready(function () {

    //////////////////////////////////////////////////
    // Run SVG Sprite
    svg4everybody();

    //////////////////////////////////////////////////
    // Global Navigation
    function globalNavDropdowns (e) {
        var t = this
        this.container = document.querySelector(e),
        this.root = this.container.querySelector('.globalNav__root'),
        this.primaryNav = this.root.querySelector('.menu__list'),
        this.primaryNavItem = this.root.querySelector('.menu__list .menu__item:last-child'),
        this.container.classList.add('globalNav--noDropdownTransition'),
        this.dropdownBackground = this.container.querySelector('.menuDropdown__background'),
        this.dropdownBackgroundAlt = this.container.querySelector('.menuDropdown__alternateBackground'),
        this.dropdownContainer = this.container.querySelector('.menuDropdown__container'),
        this.dropdownArrow = this.container.querySelector('.menuDropdown__arrow'),
        this.dropdownRoots = Strut.queryArray('.menu__item--hasDropdown', this.root),
        this.dropdownSections = Strut.queryArray('.menuDropdown__section', this.container).map(function (e) {
            return {
                el: e,
                name: e.getAttribute('data-dropdown'),
                content: e.querySelector('.menuDropdown__content')
            }
        })

        var n = window.PointerEvent ? {
            end: 'pointerup',
            enter: 'pointerenter',
            leave: 'pointerleave'
        } : {
            end: 'touchend',
            enter: 'mouseenter',
            leave: 'mouseleave'
        }
        this.dropdownRoots.forEach(function (e, r) {
            e.addEventListener(n.end, function (n) {
                n.preventDefault(),
                n.stopPropagation(),
                t.toggleDropdown(e)
            }),
            e.addEventListener(n.enter, function (n) {
                if (n.pointerType == 'touch')
                    return
                t.stopCloseTimeout(),
                t.openDropdown(e)
            }),
            e.addEventListener(n.leave, function (e) {
                if (e.pointerType == 'touch')
                    return
                t.startCloseTimeout()
            })
        }),
        this.dropdownContainer.addEventListener(n.end, function (e) {
            e.stopPropagation()
        }),
        this.dropdownContainer.addEventListener(n.enter, function (e) {
            if (e.pointerType == 'touch')
                return
            t.stopCloseTimeout()
        }),
        this.dropdownContainer.addEventListener(n.leave, function (e) {
            if (e.pointerType == 'touch')
                return
            t.startCloseTimeout()
        })
    }

    var Strut = {
        random: function (e, t) {
            return Math.random() * (t - e) + e
        },
        arrayRandom: function (e) {
            return e[Math.floor(Math.random() * e.length)]
        },
        interpolate: function (e, t, n) {
            return e * (1 - n) + t * n
        },
        rangePosition: function (e, t, n) {
            return (n - e) / (t - e)
        },
        clamp: function (e, t, n) {
            return Math.max(Math.min(e, n), t)
        },
        queryArray: function (e, t) {
            return t || (t = document.body),
            Array.prototype.slice.call(t.querySelectorAll(e))
        },
        ready: function (e) {
            document.readyState !== 'loading' ? e() : document.addEventListener('DOMContentLoaded', e)
        }
    }

    globalNavDropdowns.prototype.openDropdown = function (e) {
        var t = this
        if (this.activeDropdown === e)
            return
        this.container.classList.add('globalNav--dropdownActive'),
        this.activeDropdown = e,
        this.dropdownRoots.forEach(function (e, t) {
            e.classList.remove('active')
        }),
        e.classList.add('active')
        var n = e.getAttribute('data-dropdown'), r = 'left', i, s, o
        this.dropdownSections.forEach(function (e) {
            e.el.classList.remove('active'),
            e.el.classList.remove('left'),
            e.el.classList.remove('right'),
            e.name == n ? (e.el.classList.add('active'),
                r = 'right',
                i = e.content.offsetWidth,
                s = e.content.offsetHeight,
                e.content.getAttribute('data-fixed') ? e.content.setAttribute('data-fixed', !0) : (e.content.style.width = i + 'px',
                    e.content.style.height = s + 'px'),
                o = e.content) : e.el.classList.add(r)
        })
        var u = 380
        , a = 400
        , f = i / u
        , l = s / a
        , c = e.getBoundingClientRect()
        , h = c.left + c.width / 2 - i / 2
        h = Math.round(Math.max(h, 10)),
        clearTimeout(this.disableTransitionTimeout),
        this.enableTransitionTimeout = setTimeout(function () {
            t.container.classList.remove('globalNav--noDropdownTransition')
        }, 50),
        this.dropdownBackground.style.transform = 'translateX(' + h + 'px) scaleX(' + f + ') scaleY(' + l + ')',
        this.dropdownContainer.style.transform = 'translateX(' + h + 'px)',
        this.dropdownContainer.style.width = i + 'px',
        this.dropdownContainer.style.height = s + 'px'
        var p = Math.round(c.left + c.width / 2)
        this.dropdownArrow.style.transform = 'translateX(' + p + 'px) rotate(45deg)'
        var d = o.children[0].offsetHeight / l
        this.dropdownBackgroundAlt.style.transform = 'translateY(' + d + 'px)'
    }
    globalNavDropdowns.prototype.closeDropdown = function () {
        var e = this
        if (!this.activeDropdown)
            return
        this.dropdownRoots.forEach(function (e, t) {
            e.classList.remove('active')
        }),
        clearTimeout(this.enableTransitionTimeout),
        this.disableTransitionTimeout = setTimeout(function () {
            e.container.classList.add('globalNav--noDropdownTransition')
        }, 50),
        this.container.classList.remove('globalNav--dropdownActive'),
        this.activeDropdown = undefined
    }
    globalNavDropdowns.prototype.toggleDropdown = function (e) {
        this.activeDropdown === e ? this.closeDropdown() : this.openDropdown(e)
    }
    globalNavDropdowns.prototype.startCloseTimeout = function () {
        var e = this
        e.closeDropdownTimeout = setTimeout(function () {
            e.closeDropdown()
        }, 50)
    }
    globalNavDropdowns.prototype.stopCloseTimeout = function () {
        var e = this
        clearTimeout(e.closeDropdownTimeout)
    }
    Strut.ready(function () {
        new globalNavDropdowns('.globalNav')
    })

    $("#white-wave").wavify({
        height: 75,
        bones: 1,
        amplitude: 45,
        color: "white",
        speed: .20
    });

    $("#gradient-wave").wavify({
        height: 70,
        bones: 1,
        amplitude: 40,
        speed: .25
    });

    var myVideo = document.getElementById("video");
    myVideo.oncanplay = function() {
        myVideo.pause();
        $('.pageLoader').addClass('loaded');
        setTimeout(function() {
            $('.pageLoader').addClass('hidden');
            myVideo.play();
        }, 200);
    };
    myVideo.onended = function() {
        $('.pageHeader__introWrap').addClass('show');
    };

    var waveGradientAnimation = new TimelineMax({repeat:-1,yoyo:true})

    waveGradientAnimation.to("#grad stop:nth-child(1)", 1, {attr: {offset: 0}, stopColor:'#121F52'})
    .to("#grad stop:nth-child(2)",1,{attr:{offset:1},stopColor:'#13454A'}, 0)
});