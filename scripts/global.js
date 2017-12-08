function Carousel(arr, direction, stay, sec) {
    var arr = arr || ['gallery', 'list', 'item', 'btn', 'span'];
    // 轮播插件容器
    this.container = document.getElementById(arr[0]);
    // 轮播核心组件，用于容纳显示内容
    this.elem = this.container.getElementsByClassName(arr[1])[0];
    // 内容组
    this.items = this.elem.getElementsByClassName(arr[2]);
    // 用于切换的按钮
    this.btns = this.container.getElementsByClassName(arr[3])[0].getElementsByTagName(arr[4]);
    // 轮播时按x轴或y轴轮转
    this.direction = direction || 'left';
    // 当前图片索引
    this.index = 1;
    this.len = this.btns.length;
    // 是否在运行动画
    this.animated = false;
    // 每项内容停留的时间
    this.stay = stay || 2000;
    // 不同内容之间切换的时间
    this.sec = sec || 300;
    this.timer = null;
}

Carousel.prototype.init = function() {
    this.headToTail()
    this.play();
    this.btnEvent();
}

Carousel.prototype.headToTail = function() {
    var first = this.items[this.len - 1].cloneNode(true),
        last = this.items[0].cloneNode(true);

    this.elem.insertBefore(first, this.items[0]);
    this.elem.style[this.direction] = '-100%';
    this.elem.appendChild(last);
}

Carousel.prototype.animate = function(offset) {
    if (offset === 0) return;
    this.animated = true;
    var interval = 50,  // 内容切换动画的时间间隔
        step = offset / (this.sec / interval),
        // 需要移动到的目标位置
        des = parseInt(this.elem.style[this.direction]) + offset;

    (function recurse() {
        currentPos = this.elem.style[this.direction];
        // 判断是否需要移动
        if ((step > 0 && parseInt(currentPos) < des) || (step < 0 && parseInt(currentPos) > des)) {
            this.elem.style[this.direction] = parseInt(currentPos) + step + '%';
            recurse.bind(this)();
        } else {
            this.elem.style[this.direction] = des + '%';
            if (des > -100) {
                this.elem.style[this.direction] = -100 * this.len + '%';
            }
            if (des < (-100 * this.len)) {
                this.elem.style[this.direction] = '-100%';
            }
            this.animated = false;
        }
    }).bind(this)();
}

Carousel.prototype.switchButton = function() {
    for (var i = 0; i < this.btns.length; i++) {
        if (this.btns[i].className === 'on') {
            this.btns[i].className = '';
            break;
        }
    }
    this.btns[this.index - 1].className = 'on';
}

Carousel.prototype.next = function() {
    if (this.animated) return;
    if (this.index === this.len) {
        this.index = 1;
    } else {
        this.index += 1;
    }

    this.animate(-100);
    this.switchButton();
}

Carousel.prototype.pre = function() {
    if (this.animated) return;
    if (this.index === 1) {
        this.index = this.len;
    } else {
        this.index -= 1;
    }

    this.animate(100);
    switchButton();
}

Carousel.prototype.play = function() {
    this.timer = setTimeout(function() {
        this.next();
        this.play();
    }.bind(this), this.stay);
}

Carousel.prototype.stop = function() {
    clearTimeout(this.timer);
}

Carousel.prototype.btnEvent = function() {
    var self = this;
    for (var i = 0; i < this.btns.length; i++) {
        self.btns[i].onclick = function() {
            if (this.animated) return;
            if (this.className === 'on') return;

            var toIndex = parseInt(this.getAttribute('val')),
                offset = -100 * (toIndex - self.index);

            self.animate(offset);
            self.index = toIndex;
            self.switchButton();
        }
    }
}

window.onload = function() {
    var gallery = new Carousel(),
        articles = new Carousel(
            ['area', 'arti-list', 'article', 'btn', 'span'],
            direction = 'top'
        ),
        product = new Carousel(
            ['shoes', 'pro-list', 'shoe', 'level', 'div']
        ),
        preBtn = document.getElementsByClassName('left')[0],
        nextBtn = document.getElementsByClassName('right')[0];

    gallery.init();
    articles.init();
    product.init();

    preBtn.onclick = function() {
        product.pre();
    };
    nextBtn.onclick = function() {
        product.next();
    };
}
