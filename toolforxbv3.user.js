// ==UserScript==
// @name                 Tool Dành cho Xbox Cloud V3.4
// @name:zh-CN           Tool Dành cho Xbox Cloud V3.4
// @namespace            http://tampermonkey.net/xbox/test 3nft
// @version              3.4
// @author               (Nephalem) Việt hoá by Kênh Youtube Xbox Cloud Việt Nam
// @license              MIT
// @match                https://www.xbox.com/*/play*
// @run-at               document-start
// @grant                unsafeWindow
// @require              https://raw.githubusercontent.com/Doann7457/xcloud/main0/v3/jquery.min.js
// @original-script      1
// @description:zh-cn    Tiện ích bổ trợ Cho Xbox Cloud Gaming V3 . Việt hoá bởi Nguyễn Văn Đoàn. Video hướng dẫn và Cách sử dụng tại Kênh Youtube Xbox Cloud Việt Nam
// @description          Tiện ích bổ trợ Cho Xbox Cloud Gaming V3 . Việt hoá bởi Nguyễn Văn Đoàn. Video hướng dẫn và Cách sử dụng tại Kênh Youtube Xbox Cloud Việt Nam
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...

    let nftxboxversion = 'v3';

    //========↓↓↓↓↓ là cài đặt ban đầu của từng chức năng, chỉ có hiệu lực khi chạy script lần đầu tiên↓↓↓↓↓=========//
    //★★ 1=bật 0=tắt ★★//

    //Kết nối trực tiếp không cần proxy
    let no_need_VPN_play = 1;

    let regionsList = { 'Korea': '168.126.63.1', 'US': '4.2.2.2', 'Japan': '210.131.113.123' }

    //欺骗IP
    let fakeIp = regionsList['US'];

    //Chọn ngôn ngữ
    let chooseLanguage = 0;
    // Ngôn ngữ được sử dụng mặc định khi ngôn ngữ thông minh báo lỗi, zh-CN đơn giản, zh-TW truyền thống, công tắc chính là chooseLanguage ở dòng trước
    let IfErrUsedefaultGameLanguage = 'zh-CN';

    ///Tốc độ bit cao, lên tới 8M sau khi bị tắt, tốc độ bit chất lượng 720P
    let high_bitrate = 0;

    // buộc chạm
    let autoOpenOC = 1;

    // Vô hiệu hóa phát hiện trạng thái mạng
    let disableCheckNetwork = 1;

    // Tự động toàn màn hình
    let autoFullScreen = 1;

    //Khóa server game trên cloud, lưu ý mục này không phải là khu vực game trên cloud (mặc định đóng)
    let blockXcloudServer = 0;
    let blockXcloudServerList = ['AustraliaEast', 'AustraliaSouthEast', 'BrazilSouth', 'EastUS', 'EastUS2', 'JapanEast', 'KoreaCentral', 'NorthCentralUs', 'SouthCentralUS', 'UKSouth', 'WestEurope', 'WestUS', 'WestUS2'];
    let defaultXcloudServer = 'KoreaCentral';

    //Xóa viền đen của video
    let video_stretch = {
        'default': 'tràn Toàn màn hình',
        'options': {
            'none': 'không',
            'fill': 'tràn Toàn màn hình',
            'setting': 'Tuỳ chỉnh',
        },
        'name': 'video_stretchGM'
    }

    let video_stretch_x_y = {
        'x': 0.24,
        'y': 0,
        'name': 'video_stretch_x_yGM'
    }

    let noPopSetting = 0;

    // Shield touch (đóng theo mặc định)
    let disableTouchControls = 0;
    let canShowOC = false;
    let autoShowTouch = true;

    let STATS_SHOW_WHEN_PLAYING = { "default": false, "name": "STATS_SHOW_WHEN_PLAYINGGM" };

    let STATS_POSITION = { 'default': 'top-left', 'options': { 'top-left': 'trái', 'top-center': 'giữa', 'top-right': 'phải' }, 'name': 'STATS_POSITIONGM' }

    let STATS_TRANSPARENT = { "default": false, "name": "STATS_TRANSPARENTGM" };
    let STATS_OPACITY = {
        'default': 80,
        'min': 10,
        'max': 100,
        'name': 'STATS_OPACITYGM'
    };

    let STATS_TEXT_SIZE = {
        'default': '0.9rem',
        'options': {
            '0.9rem': 'Bé nhỏ',
            '1.0rem': 'ở giữa',
            '1.1rem': 'to lớn',
        },
        'name': 'STATS_TEXT_SIZEGM'
    }

    let STATS_CONDITIONAL_FORMATTING = { "default": false, "name": "STATS_CONDITIONAL_FORMATTINGGM" };

    let VIDEO_CLARITY = {
        'default': 0,
        'min': 0,
        'max': 3,
        'name': 'VIDEO_CLARITYGM'
    }

    let VIDEO_CONTRAST = {
        'default': 100,
        'min': 0,
        'max': 150,
        'name': 'VIDEO_CONTRASTGM'
    }

    let VIDEO_SATURATION = {
        'default': 100,
        'min': 0,
        'max': 150,
        'name': 'VIDEO_SATURATIONGM'
    }
    let VIDEO_BRIGHTNESS = {
        'default': 100,
        'min': 0,
        'max': 150,
        'name': 'VIDEO_BRIGHTNESSGM'
    }

    // Treo lên để khỏi bị đá
    let antiKick = 0;

    //========↑↑↑↑↑ là cài đặt ban đầu của từng chức năng, chỉ có script chạy lần đầu là hợp lệ ↑↑↑↑↑=========//

    const originFetch = fetch;
    let regionsMenuItemList = [];
    let languageMenuItemList = [];
    let default_language_list={'Thông minh':'Auto','China':'zh-CN','giản thể':'zh-TW'}
    let xcloud_game_language=default_language_list['giản thể'];//
    let useCustomfakeIp = 0;
    let customfakeIp = '';
    let letmeOb = true;

    let STREAM_WEBRTC;
    const ICON_STREAM_STATS = '<path d="M12.005 5C9.184 5 6.749 6.416 5.009 7.903c-.87.743-1.571 1.51-2.074 2.18-.251.335-.452.644-.605.934-.434.733-.389 1.314-.004 1.98a6.98 6.98 0 0 0 .609.949 13.62 13.62 0 0 0 2.076 2.182C6.753 17.606 9.188 19 12.005 19s5.252-1.394 6.994-2.873a13.62 13.62 0 0 0 2.076-2.182 6.98 6.98 0 0 0 .609-.949c.425-.737.364-1.343-.004-1.98-.154-.29-.354-.599-.605-.934-.503-.669-1.204-1.436-2.074-2.18C17.261 6.416 14.826 5 12.005 5zm0 2c2.135 0 4.189 1.135 5.697 2.424.754.644 1.368 1.32 1.773 1.859.203.27.354.509.351.733s-.151.462-.353.732c-.404.541-1.016 1.214-1.77 1.854C16.198 15.881 14.145 17 12.005 17s-4.193-1.12-5.699-2.398a11.8 11.8 0 0 1-1.77-1.854c-.202-.27-.351-.508-.353-.732s.149-.463.351-.733c.406-.54 1.019-1.215 1.773-1.859C7.816 8.135 9.87 7 12.005 7zm.025 1.975c-1.645 0-3 1.355-3 3s1.355 3 3 3 3-1.355 3-3-1.355-3-3-3zm0 2c.564 0 1 .436 1 1s-.436 1-1 1-1-.436-1-1 .436-1 1-1z"/>';
    const ICON_VIDEO_SETTINGS = '<path d="M16 9.144A6.89 6.89 0 0 0 9.144 16 6.89 6.89 0 0 0 16 22.856 6.89 6.89 0 0 0 22.856 16 6.9 6.9 0 0 0 16 9.144zm0 11.427c-2.507 0-4.571-2.064-4.571-4.571s2.064-4.571 4.571-4.571 4.571 2.064 4.571 4.571-2.064 4.571-4.571 4.571zm15.704-7.541c-.065-.326-.267-.607-.556-.771l-4.26-2.428-.017-4.802c-.001-.335-.15-.652-.405-.868-1.546-1.307-3.325-2.309-5.245-2.953-.306-.103-.641-.073-.923.085L16 3.694l-4.302-2.407c-.282-.158-.618-.189-.924-.086a16.02 16.02 0 0 0-5.239 2.964 1.14 1.14 0 0 0-.403.867L5.109 9.84.848 12.268a1.14 1.14 0 0 0-.555.771 15.22 15.22 0 0 0 0 5.936c.064.326.267.607.555.771l4.261 2.428.017 4.802c.001.335.149.652.403.868 1.546 1.307 3.326 2.309 5.245 2.953.306.103.641.073.923-.085L16 28.306l4.302 2.407a1.13 1.13 0 0 0 .558.143 1.18 1.18 0 0 0 .367-.059c1.917-.648 3.695-1.652 5.239-2.962.255-.216.402-.532.405-.866l.021-4.807 4.261-2.428a1.14 1.14 0 0 0 .555-.771 15.21 15.21 0 0 0-.003-5.931zm-2.143 4.987l-4.082 2.321a1.15 1.15 0 0 0-.429.429l-.258.438a1.13 1.13 0 0 0-.174.601l-.022 4.606a13.71 13.71 0 0 1-3.623 2.043l-4.117-2.295a1.15 1.15 0 0 0-.559-.143h-.546c-.205-.005-.407.045-.586.143l-4.119 2.3a13.74 13.74 0 0 1-3.634-2.033l-.016-4.599a1.14 1.14 0 0 0-.174-.603l-.257-.437c-.102-.182-.249-.333-.429-.437l-4.085-2.328a12.92 12.92 0 0 1 0-4.036l4.074-2.325a1.15 1.15 0 0 0 .429-.429l.258-.438a1.14 1.14 0 0 0 .175-.601l.021-4.606a13.7 13.7 0 0 1 3.625-2.043l4.11 2.295a1.14 1.14 0 0 0 .585.143h.52c.205.005.407-.045.586-.143l4.119-2.3a13.74 13.74 0 0 1 3.634 2.033l.016 4.599a1.14 1.14 0 0 0 .174.603l.257.437c.102.182.249.333.429.438l4.085 2.327a12.88 12.88 0 0 1 .007 4.041h.007z" fill-rule="nonzero"/>';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("使用unsafeWindow模式");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("使用原生模式");
    }

    let naifeitian = {
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        getValue(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        },

        setValue(key, value) {
            if (this.isType(value) === 'object' || this.isType(value) === 'array' || this.isType(value) === 'boolean') {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            return localStorage.setItem(key, value);
        },
        isValidIP(ip) {
            let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            return reg.test(ip);
        },
        isNumber(val) {
            return !isNaN(parseFloat(val)) && isFinite(val);
        },
        killTouchMove(v) {
            $(v).on('touchmove', false);
        },
        renewTouchMove(v) {
            $(v).off('touchmove', false);
        },
        toElement(key, onChange) {
            const CE = createElement;
            const setting = key;
            const currentValue = key['default'] == undefined ? key : key['default'];

            let $control;
            if (setting['options'] != undefined) {

                $control = CE('select', { id: 'xcloud_setting_' + key['name'] });

                for (let value in setting.options) {
                    const label = setting.options[value];

                    const $option = CE('option', { value: value }, label);
                    $control.appendChild($option);
                }

                $control.value = currentValue;
                $control.addEventListener('change', e => {
                    key['default'] = e.target.value;

                    this.setValue(key['name'], key);
                    onChange && onChange(e);
                });

            } else if (typeof setting.default === 'number') {
                $control = CE('input', { 'type': 'number', 'min': setting.min, 'max': setting.max });

                $control.value = currentValue;
                $control.addEventListener('change', e => {
                    let value = Math.max(setting.min, Math.min(setting.max, parseInt(e.target.value)));
                    e.target.value = value;

                    key['default'] = e.target.value
                    this.setValue(key['name'], key);
                    onChange && onChange(e);
                });
            } else {
                $control = CE('input', { 'type': 'checkbox' });
                $control.checked = currentValue;

                $control.addEventListener('change', e => {
                    key['default'] = e.target.checked
                    this.setValue(key['name'], key);
                    onChange && onChange(e);
                });
            }

            $control.id = `xcloud_setting_${key.name}`;
            return $control;
        },
        addMeta(name, content) {
            const meta = document.createElement('meta');
            meta.content = content;
            meta.name = name;
            document.getElementsByTagName('head')[0].appendChild(meta);
        },
        isSafari() {
            let userAgent = userAgentOriginal.toLowerCase();
            if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) {
                return true;
            } else {
                return false;
            }
        },
        getGM(defaultValue, n) {
            let newval = this.getValue(n)==null? defaultValue:this.getValue(n);
            naifeitian.setValue(n, newval);
            return newval;
        }

    }

    // Quickly create a tree of elements without having to use innerHTML
    function createElement(elmName, props = {}) {
        let $elm;
        const hasNs = 'xmlns' in props;

        if (hasNs) {
            $elm = document.createElementNS(props.xmlns, elmName);
        } else {
            $elm = document.createElement(elmName);
        }

        for (let key in props) {
            if (key === 'xmlns') {
                continue;
            }

            if (!props.hasOwnProperty(key) || $elm.hasOwnProperty(key)) {
                continue;
            }

            if (hasNs) {
                $elm.setAttributeNS(null, key, props[key]);
            } else {
                $elm.setAttribute(key, props[key]);
            }
        }

        for (let i = 2, size = arguments.length; i < size; i++) {
            const arg = arguments[i];
            const argType = typeof arg;

            if (argType === 'string' || argType === 'number') {
                $elm.textContent = arg;
            } else if (arg) {
                $elm.appendChild(arg);
            }
        }

        return $elm;
    }

    function setMachineFullScreen() {
        try {
            let element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            }
            screen?.orientation?.lock("landscape");
        } catch (e) {
        }
    }

    function exitMachineFullscreen() {
        try {
            screen?.orientation?.unlock();
            if (document.exitFullScreen) {
                document.exitFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (element.msExitFullscreen) {
                element.msExitFullscreen();
            }
        } catch (e) {
        }
    }

    blockXcloudServerList = naifeitian.getGM(blockXcloudServerList, 'blockXcloudServerListGM');
    no_need_VPN_play = naifeitian.getGM(no_need_VPN_play, 'no_need_VPN_playGM');
    chooseLanguage = naifeitian.getGM(chooseLanguage, 'chooseLanguageGM');
    IfErrUsedefaultGameLanguage = naifeitian.getGM(IfErrUsedefaultGameLanguage, 'IfErrUsedefaultGameLanguageGM');
    fakeIp = naifeitian.getGM(fakeIp, 'fakeIpGM');
    high_bitrate = naifeitian.getGM(high_bitrate, 'high_bitrateGM');
    autoOpenOC = naifeitian.getGM(autoOpenOC, 'autoOpenOCGM');
    disableCheckNetwork = naifeitian.getGM(disableCheckNetwork, 'disableCheckNetworkGM');
    defaultXcloudServer = naifeitian.getGM(defaultXcloudServer, 'defaultXcloudServerGM');
    blockXcloudServer = naifeitian.getGM(blockXcloudServer, 'blockXcloudServerGM');
    xcloud_game_language = naifeitian.getGM(xcloud_game_language, 'xcloud_game_languageGM');
    useCustomfakeIp = naifeitian.getGM(useCustomfakeIp, 'useCustomfakeIpGM');
    customfakeIp = naifeitian.getGM(customfakeIp, 'customfakeIpGM');
    autoFullScreen = naifeitian.getGM(autoFullScreen, 'autoFullScreenGM');
    disableTouchControls = naifeitian.getGM(disableTouchControls, 'disableTouchControlsGM');
    STATS_SHOW_WHEN_PLAYING = naifeitian.getGM(STATS_SHOW_WHEN_PLAYING, 'STATS_SHOW_WHEN_PLAYINGGM');
    STATS_POSITION = naifeitian.getGM(STATS_POSITION, 'STATS_POSITIONGM');
    STATS_TRANSPARENT = naifeitian.getGM(STATS_TRANSPARENT, 'STATS_TRANSPARENTGM');
    STATS_OPACITY = naifeitian.getGM(STATS_OPACITY, 'STATS_OPACITYGM');
    STATS_TEXT_SIZE = naifeitian.getGM(STATS_TEXT_SIZE, 'STATS_TEXT_SIZEGM');
    STATS_CONDITIONAL_FORMATTING = naifeitian.getGM(STATS_CONDITIONAL_FORMATTING, 'STATS_CONDITIONAL_FORMATTINGGm');
    noPopSetting = naifeitian.getGM(noPopSetting, 'noPopSettingGM');
    autoShowTouch = naifeitian.getGM(autoShowTouch, 'autoShowTouchGM');
    VIDEO_CLARITY = naifeitian.getGM(VIDEO_CLARITY, 'VIDEO_CLARITYGM');
    VIDEO_CONTRAST = naifeitian.getGM(VIDEO_CONTRAST, 'VIDEO_CONTRASTGM');
    VIDEO_SATURATION = naifeitian.getGM(VIDEO_SATURATION, 'VIDEO_SATURATIONGM');
    VIDEO_BRIGHTNESS = naifeitian.getGM(VIDEO_BRIGHTNESS, 'VIDEO_BRIGHTNESSGM');
    video_stretch = naifeitian.getGM(video_stretch, 'video_stretchGM');
    video_stretch_x_y = naifeitian.getGM(video_stretch_x_y, 'video_stretch_x_yGM');
    antiKick = naifeitian.getGM(antiKick, 'antiKickGM');

    class StreamStats {
        static #interval;
        static #updateInterval = 1000;

    static #$container;
    static #$fps;
    static #$rtt;
    static #$dt;
    static #$pl;
    static #$fl;
    static #$br;

    static #$settings;

    static #lastStat;

    static start() {

        StreamStats.#$container.classList.remove('better-xcloud-gone');
        StreamStats.#interval = setInterval(StreamStats.update, StreamStats.#updateInterval);
    }

    static stop() {
        clearInterval(StreamStats.#interval);

        StreamStats.#$container.classList.add('better-xcloud-gone');
        StreamStats.#interval = null;
        StreamStats.#lastStat = null;
    }

    static toggle() {
        StreamStats.#isHidden() ? StreamStats.start() : StreamStats.stop();
    }

    static #isHidden = () => StreamStats.#$container.classList.contains('better-xcloud-gone');

    static update() {
        if (StreamStats.#isHidden() || !STREAM_WEBRTC) {
            StreamStats.stop();
            return;
        }

        const PREF_STATS_CONDITIONAL_FORMATTING = STATS_CONDITIONAL_FORMATTING;
        STREAM_WEBRTC.getStats().then(stats => {
            stats.forEach(stat => {
                let grade = '';
                if (stat.type === 'inbound-rtp' && stat.kind === 'video') {
                    // FPS
                    StreamStats.#$fps.textContent = stat.framesPerSecond || 0;

                    // Packets Lost
                    const packetsLost = stat.packetsLost;
                    const packetsReceived = stat.packetsReceived;
                    const packetsLostPercentage = (packetsLost * 100 / ((packetsLost + packetsReceived) || 1)).toFixed(2);
                    StreamStats.#$pl.textContent = `${packetsLost} (${packetsLostPercentage}%)`;

                    // Frames Dropped
                    const framesDropped = stat.framesDropped;
                    if (framesDropped !== undefined) {
                        const framesReceived = stat.framesReceived;
                        const framesDroppedPercentage = (framesDropped * 100 / ((framesDropped + framesReceived) || 1)).toFixed(2);
                        StreamStats.#$fl.textContent = `${framesDropped} (${framesDroppedPercentage}%)`;
                    }

                    if (StreamStats.#lastStat) {
                        const lastStat = StreamStats.#lastStat;
                        // Bitrate
                        const timeDiff = stat.timestamp - lastStat.timestamp;
                        const bitrate = 8 * (stat.bytesReceived - lastStat.bytesReceived) / timeDiff / 1000;
                        StreamStats.#$br.textContent = `${bitrate.toFixed(2)} Mbps`;

                        // Decode time
                        const totalDecodeTimeDiff = stat.totalDecodeTime - lastStat.totalDecodeTime;
                        const framesDecodedDiff = stat.framesDecoded - lastStat.framesDecoded;
                        const currentDecodeTime = totalDecodeTimeDiff / framesDecodedDiff * 1000;
                        StreamStats.#$dt.textContent = `${currentDecodeTime.toFixed(2)}ms`;

                        if (PREF_STATS_CONDITIONAL_FORMATTING['default']) {
                            grade = (currentDecodeTime > 12) ? 'bad' : (currentDecodeTime > 9) ? 'ok' : (currentDecodeTime > 6) ? 'good' : '';
                        }
                        StreamStats.#$dt.setAttribute('data-grade', grade);
                    }

                    StreamStats.#lastStat = stat;
                } else if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
                    // Round Trip Time
                    const roundTripTime = typeof stat.currentRoundTripTime !== 'undefined' ? stat.currentRoundTripTime * 1000 : '???';
                    StreamStats.#$rtt.textContent = `${roundTripTime}ms`;

                    if (PREF_STATS_CONDITIONAL_FORMATTING['default']) {
                        grade = (roundTripTime > 100) ? 'bad' : (roundTripTime > 75) ? 'ok' : (roundTripTime > 40) ? 'good' : '';
                    }
                    StreamStats.#$rtt.setAttribute('data-grade', grade);
                }
            });
        });
    }

    static #refreshStyles() {
        const PREF_POSITION = STATS_POSITION['default'];
        const PREF_TRANSPARENT = STATS_TRANSPARENT['default'];
        const PREF_OPACITY = STATS_OPACITY['default'];
        const PREF_TEXT_SIZE = STATS_TEXT_SIZE['default'];

        StreamStats.#$container.setAttribute('data-position', PREF_POSITION);
        StreamStats.#$container.setAttribute('data-transparent', PREF_TRANSPARENT);
        StreamStats.#$container.style.opacity = PREF_OPACITY + '%';
        StreamStats.#$container.style.fontSize = PREF_TEXT_SIZE;
    }

    static hideSettingsUi() {
        StreamStats.#$settings.style.display = 'none';
    }

    static #toggleSettingsUi() {
        const display = StreamStats.#$settings.style.display;
        StreamStats.#$settings.style.display = display === 'block' ? 'none' : 'block';
    }

    static render() {
        if (StreamStats.#$container) {
            return;
        }

        const CE = createElement;
        StreamStats.#$container = CE('div', { 'class': 'better-xcloud-stats-bar better-xcloud-gone' },
                                     CE('label', {}, 'khung hình'),
                                     StreamStats.#$fps = CE('span', {}, 0),
                                     CE('label', {}, 'độ trễ'),
                                     StreamStats.#$rtt = CE('span', {}, '0ms'),
                                     CE('label', {}, 'giải mã'),
                                     StreamStats.#$dt = CE('span', {}, '0ms'),
                                     CE('label', {}, 'Tốc độ mạng'),
                                     StreamStats.#$br = CE('span', {}, '0 Mbps'),
                                     CE('label', {}, 'Mất gói'),
                                     StreamStats.#$pl = CE('span', {}, '0 (0.00%)'),
                                     CE('label', {}, 'thả khung'),
                                     StreamStats.#$fl = CE('span', {}, '0 (0.00%)'));

        let clickTimeout;
        StreamStats.#$container.addEventListener('mousedown', e => {
            clearTimeout(clickTimeout);
            if (clickTimeout) {
                // Double-clicked
                clickTimeout = null;
                StreamStats.#toggleSettingsUi();
                return;
            }

            clickTimeout = setTimeout(() => {
                clickTimeout = null;
            }, 400);
        });

        document.documentElement.appendChild(StreamStats.#$container);

        const refreshFunc = e => {
            StreamStats.#refreshStyles()
        };
        const $position = naifeitian.toElement(STATS_POSITION, refreshFunc);

        let $close;
        const $showStartup = naifeitian.toElement(STATS_SHOW_WHEN_PLAYING, refreshFunc);
        const $transparent = naifeitian.toElement(STATS_TRANSPARENT, refreshFunc);
        const $formatting = naifeitian.toElement(STATS_CONDITIONAL_FORMATTING, refreshFunc);
        const $opacity = naifeitian.toElement(STATS_OPACITY, refreshFunc);
        const $textSize = naifeitian.toElement(STATS_TEXT_SIZE, refreshFunc);

        StreamStats.#$settings = CE('div', { 'class': 'better-xcloud-stats-settings' },
                                    CE('b', {}, 'Cài đặt thanh trạng thái'),
                                    CE('div', {},
                                       CE('label', { 'for': `xcloud_setting_STATS_SHOW_WHEN_PLAYING` }, 'Hiển thị thanh trạng thái khi trò chơi bắt đầu'),
                                       $showStartup
                                      ),
                                    CE('div', {},
                                       CE('label', {}, 'Vị trí'),
                                       $position
                                      ),
                                    CE('div', {},
                                       CE('label', {}, 'cỡ chữ'),
                                       $textSize
                                      ),
                                    CE('div', {},
                                       CE('label', { 'for': `xcloud_setting_STATS_OPACITY` }, 'độ rõ nét (10-100%)'),
                                       $opacity
                                      ),
                                    CE('div', {},
                                       CE('label', { 'for': `xcloud_setting_STATS_TRANSPARENT` }, 'nền trong suốt'),
                                       $transparent
                                      ),
                                    CE('div', {},
                                       CE('label', { 'for': `xcloud_setting_STATS_CONDITIONAL_FORMATTING` }, 'số có màu'),
                                       $formatting
                                      ),
                                    $close = CE('button', {}, 'Khép kín'));

        $close.addEventListener('click', e => StreamStats.hideSettingsUi());
        document.documentElement.appendChild(StreamStats.#$settings);

        StreamStats.#refreshStyles();
    }
}
 function numberPicker(key, suffix = '', disabled = false) {
    const setting = key.name;
    let value = key.default;
    let $text, $decBtn, $incBtn;

    const MIN = key.min;
    const MAX = key.max;

    const CE = createElement;
    const $wrapper = CE('div', {},
                        $decBtn = CE('button', { 'data-type': 'dec' }, '-'),
                        $text = CE('span', {}, value + suffix),
                        $incBtn = CE('button', { 'data-type': 'inc' }, '+'),
                       );

    if (disabled) {
        $incBtn.disabled = true;
        $incBtn.classList.add('better-xcloud-hidden');

        $decBtn.disabled = true;
        $decBtn.classList.add('better-xcloud-hidden');
        return $wrapper;
    }

    let interval;
    let isHolding = false;

    const onClick = e => {
        if (isHolding) {
            e.preventDefault();
            isHolding = false;

            return;
        }

        const btnType = e.target.getAttribute('data-type');
        if (btnType === 'dec') {
            value = (value <= MIN) ? MIN : value - 1;
        } else {
            value = (value >= MAX) ? MAX : value + 1;
        }

        $text.textContent = value + suffix;

        key['default'] = value;

        naifeitian.setValue(key['name'], key);

        updateVideoPlayerCss();

        isHolding = false;
    }

    const onMouseDown = e => {
        isHolding = true;

        const args = arguments;
        interval = setInterval(() => {
            const event = new Event('click');
            event.arguments = args;

            e.target.dispatchEvent(event);
        }, 200);
    };

    const onMouseUp = e => {
        clearInterval(interval);
        isHolding = false;
    };

    $decBtn.addEventListener('click', onClick);
    $decBtn.addEventListener('mousedown', onMouseDown);
    $decBtn.addEventListener('mouseup', onMouseUp);
    $decBtn.addEventListener('touchstart', onMouseDown);
    $decBtn.addEventListener('touchend', onMouseUp);

    $incBtn.addEventListener('click', onClick);
    $incBtn.addEventListener('mousedown', onMouseDown);
    $incBtn.addEventListener('mouseup', onMouseUp);
    $incBtn.addEventListener('touchstart', onMouseDown);
    $incBtn.addEventListener('touchend', onMouseUp);

    return $wrapper;
}

function setupVideoSettingsBar() {
    const CE = createElement;
    let $stretchInp;
    const refreshFunc = e => {
        updateVideoPlayerCss();
    };
    const $stretch = naifeitian.toElement(video_stretch, refreshFunc);
    const $wrapper = CE('div', { 'class': 'better-xcloud-quick-settings-bar' },
                        CE('div', {},
                           CE('label', { 'for': 'better-xcloud-quick-setting-stretch' }, 'Xoá đen viền'),
                           $stretch),
                        CE('div', {},
                           CE('label', {}, 'Sắc nét hơn'),
                           numberPicker(VIDEO_CLARITY, '', naifeitian.isSafari())),
                        CE('div', {},
                           CE('label', {}, 'bão hòa'),
                           numberPicker(VIDEO_SATURATION, '%')),
                        CE('div', {},
                           CE('label', {}, 'CONTRAST'),
                           numberPicker(VIDEO_CONTRAST, '%')),
                        CE('div', {},
                           CE('label', {}, 'độ sáng'),
                           numberPicker(VIDEO_BRIGHTNESS, '%'))
                       );


    $stretch.addEventListener('change', e => {
        if (e.target.value == 'setting') {
            $('#video_stretch_x_y').css('display', 'block');
        } else {
            $('#video_stretch_x_y').css('display', 'none');
        }
        video_stretch.default = e.target.value;
        naifeitian.setValue('video_stretchGM', video_stretch);
        updateVideoPlayerCss();
    });

    document.documentElement.appendChild($wrapper);
    if ($stretch.id == 'xcloud_setting_video_stretchGM') {
        let dom = $('#xcloud_setting_video_stretchGM');
        dom.after(`<div id="video_stretch_x_y" style="display: ${video_stretch.default == 'setting' ? 'block' : 'none'}">
                     <lable>左右
                       <input type=\'text\'class="video_stretch_x_y_Listener" id="video_stretch_x" style="width:35px" value="${video_stretch_x_y['x']}"/>
                     </lable><br/>
                     <lable>上下
                       <input type=\'text\'class="video_stretch_x_y_Listener" id="video_stretch_y" style="width:35px" value="${video_stretch_x_y['y']}"/>
                     </lable>
                  </div>`);

        $(document).on('blur', '.video_stretch_x_y_Listener', function () {
            let newval = $(this).val();
            if (naifeitian.isNumber($(this).val())) {
                if ($(this).attr('id') == 'video_stretch_x') {
                    video_stretch_x_y['x'] = newval;
                    naifeitian.setValue('video_stretch_x_yGM', video_stretch_x_y);
                } else {
                    video_stretch_x_y['y'] = newval;
                    naifeitian.setValue('video_stretch_x_yGM', video_stretch_x_y);
                }
            } else {
                $(this).val("0");
                video_stretch_x_y['x'] = 0.24;
                video_stretch_x_y['y'] = 0;
                naifeitian.setValue('video_stretch_x_yGM', video_stretch_x_y);
            }
            updateVideoPlayerCss();
        });
    }
}

function cloneStreamMenuButton($orgButton, label, svg_icon) {
    const $button = $orgButton.cloneNode(true);
    $button.setAttribute('aria-label', label);
    $button.querySelector('div[class*=label]').textContent = label;

    const $svg = $button.querySelector('svg');
    $svg.innerHTML = svg_icon;
    $svg.setAttribute('viewBox', '0 0 24 24');

    return $button;
}

function HookProperty(object, property, value) {
    Object.defineProperty(object, property, {
        value: value
    });
}
let userAgentOriginal = windowCtx.navigator.userAgent;
let fakeuad = {
    "brands": [
        {
            "brand": "Microsoft Edge",
            "version": "999"
        },
        {
            "brand": "Chromium",
            "version": "999"
        },
        {
            "brand": "Not=A?Brand",
            "version": "24"
        }
    ],
    "mobile": false,
    "platform": "Windows"
};

try {
    HookProperty(windowCtx.navigator, "userAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/999.0.0.0 Safari/537.36 Edg/999.0.0.0");
    HookProperty(windowCtx.navigator, "appVersion", "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/999.0.0.0 Safari/537.36 Edg/999.0.0.0");
    HookProperty(windowCtx.navigator, "platform", "Win32");
    HookProperty(windowCtx.navigator, "appName", "Netscape");
    HookProperty(windowCtx.navigator, "appCodeName", "Mozilla");
    HookProperty(windowCtx.navigator, "product", "Gecko");
    HookProperty(windowCtx.navigator, "vendor", "Google Inc.");
    HookProperty(windowCtx.navigator, "vendorSub", "");
    HookProperty(windowCtx.navigator, "maxTouchPoints", 10);
    HookProperty(windowCtx.navigator, "userAgentData", fakeuad);
    if (disableCheckNetwork == 1) {
        Object.defineProperty(windowCtx.navigator, 'connection', {
            get: () => undefined,
        });
    }
    HookProperty(windowCtx.navigator, "standalone", true);

} catch (e) { }


windowCtx.fetch = (...arg) => {
    let arg0 = arg[0];
    let url = "";
    let isRequest = false;
    switch (typeof arg0) {
        case "object":
            url = arg0.url;
            isRequest = true;
            break;
        case "string":
            url = arg0;
            break;
        default:
            break;
    }

    if (url.indexOf('/v2/login/user') > -1) {//xgpuweb.gssv-play-prod.xboxlive.com
        return new Promise((resolve, reject) => {
            if (isRequest && arg0.method == "POST") {
                arg0.json().then(json => {
                    let body = JSON.stringify(json);
                    if (no_need_VPN_play == 1) {
                        console.log('免代理开始' + url);
                        if (useCustomfakeIp == 1 && naifeitian.isValidIP(customfakeIp)) {
                            arg[0].headers.set('x-forwarded-for', customfakeIp);
                            console.log('自定义IP:' + customfakeIp);
                        } else {
                            arg[0].headers.set('x-forwarded-for', fakeIp);
                        }
                    }

                    arg[0] = new Request(url, {
                        method: arg0.method,
                        headers: arg0.headers,
                        body: body,

                    });
                    originFetch(...arg).then(res => {
                        console.log('免代理结束');
                        res.json().then(json => {
                            let newServerList = [];
                            let currentAutoServer;
                            json["offeringSettings"]["regions"].forEach((region) => {
                                newServerList.push(region["name"]);
                                if (region["isDefault"] === true) {
                                    currentAutoServer = region["name"];
                                }
                            });
                            naifeitian.setValue("blockXcloudServerListGM", newServerList);
                            blockXcloudServerList = newServerList;
                            if (blockXcloudServerList.indexOf(defaultXcloudServer) == -1) {
                                naifeitian.setValue("defaultXcloudServerGM", "");
                                defaultXcloudServer = "";
                                blockXcloudServer = 0;
                                naifeitian.setValue("blockXcloudServerGM", 0);
                            }
                            if (blockXcloudServer == 1) {
                                console.log('修改服务器开始');
                                json["offeringSettings"]["allowRegionSelection"] = true;
                                let selectedServer = defaultXcloudServer;
                                if (selectedServer !== "Auto" && newServerList.includes(selectedServer)) {
                                    json["offeringSettings"]["regions"].forEach((region) => {
                                        if (region["name"] === selectedServer) {
                                            region["isDefault"] = true;
                                        } else {
                                            region["isDefault"] = false;
                                        }
                                    });
                                }
                                console.log('修改服务器结束');
                            }
                            let body = JSON.stringify(json);
                            let newRes = new Response(body, {
                                status: res.status,
                                statusText: res.statusText,
                                headers: res.headers
                            })
                            resolve(newRes);
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                });

            } else {
                console.error("[ERROR] Not a request.");
                return originFetch(...arg);
            }
        });
    } else if (url.indexOf('/cloud/play') > -1) {
        document.documentElement.style.overflowY = "hidden";
        if (autoFullScreen == 1) {
            setMachineFullScreen();
        }
        if (noPopSetting == 0) {
            $('#popSetting').css('display', 'none');
        }

        if (chooseLanguage == 1) {
            return new Promise(async (resolve, reject) => {
                console.log('语言开始');
                let selectedLanguage = xcloud_game_language;
                console.log('语言选择：' + selectedLanguage);
                if (selectedLanguage == 'Auto') {
                    const regex = /\/([a-zA-Z0-9]+)\/?/gm;
                    let matches;
                    let latestMatch;
                    while ((matches = regex.exec(document.location.pathname)) !== null) {
                        if (matches.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }
                        matches.forEach((match, groupIndex) => {
                            // console.log(`Found match, group ${groupIndex}: ${match}`);
                            latestMatch = match;
                        });
                    }
                    if (latestMatch) {
                        let pid = latestMatch;
                        try {
                            let res = await fetch(
                                "https://catalog.gamepass.com/products?market=US&language=en-US&hydration=PCInline", {
                                    "headers": {
                                        "content-type": "application/json;charset=UTF-8",
                                    },
                                    "body": "{\"Products\":[\"" + pid + "\"]}",
                                    "method": "POST",
                                    "mode": "cors",
                                    "credentials": "omit"
                                });
                            let jsonObj = await res.json();
                            let languageSupport = jsonObj["Products"][pid]["LanguageSupport"]
                            for (let language of Object.keys(default_language_list)) {
                                if (default_language_list[language] in languageSupport) {
                                    selectedLanguage = default_language_list[language];
                                    break;
                                }
                            }
                            if (selectedLanguage == 'Auto') {
                                //防止接口没有返回支持语言
                                selectedLanguage = IfErrUsedefaultGameLanguage;
                            }

                        } catch (e) {
                        }
                    }
                }

                if (isRequest && arg0.method == "POST") {
                    arg0.json().then(json => {

                        json["settings"]["locale"] = selectedLanguage;

                        json["settings"]["osName"] = high_bitrate == 1 ? 'windows' : 'android';
                        let body = JSON.stringify(json);

                        arg[0] = new Request(url, {
                            method: arg0.method,
                            headers: arg0.headers,
                            body: body,
                            mode: arg0.mode,
                            credentials: arg0.credentials,
                            cache: arg0.cache,
                            redirect: arg0.redirect,
                            referrer: arg0.referrer,
                            integrity: arg0.integrity
                        });
                        originFetch(...arg).then(res => {
                            console.log(`语言结束, 选择语言: ${selectedLanguage}.`)
                            resolve(res);

                        }).catch(err => {
                            reject(err);
                        });
                    });
                } else {
                    console.error("[ERROR] Not a request.");
                    return originFetch(...arg);
                }
            });
        } else {
            return originFetch(...arg);
        }
    } else if (url.indexOf('/configuration') > -1) {
        // Enable CustomTouchOverlay
        console.log('修改触摸开始')
        return new Promise((resolve, reject) => {
            originFetch(...arg).then(res => {
                res.json().then(json => {
                    // console.error(json);
                    if (autoOpenOC == 1 && disableTouchControls == 0) {
                        let inputOverrides = JSON.parse(json.clientStreamingConfigOverrides || '{}') || {};
                        inputOverrides.inputConfiguration = {
                            enableTouchInput: true,
                            maxTouchPoints: 10,
                        };
                        json.clientStreamingConfigOverrides = JSON.stringify(inputOverrides);
                        let cdom = $('#BabylonCanvasContainer-main').children();
                        if (cdom.length > 0) {
                            canShowOC = false;
                        } else {
                            canShowOC = true;
                        }
                    }
                    let body = JSON.stringify(json);
                    let newRes = new Response(body, {
                        status: res.status,
                        statusText: res.statusText,
                        headers: res.headers
                    })
                    resolve(newRes);

                    console.log('修改触摸结束')
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    } else {
        return originFetch(...arg);
    }
}
if (autoOpenOC == 1 && disableTouchControls == 0 && autoShowTouch) {
    windowCtx.RTCPeerConnection.prototype.originalCreateDataChannelGTC = windowCtx.RTCPeerConnection.prototype.createDataChannel;
    windowCtx.RTCPeerConnection.prototype.createDataChannel = function (...params) {
        let dc = this.originalCreateDataChannelGTC(...params);
        let paddingMsgTimeoutId = 0;
        if (dc.label == "message") {
            dc.addEventListener("message", function (de) {
                if (typeof (de.data) == "string") {
                    // console.debug(de.data);
                    let msgdata = JSON.parse(de.data);
                    if (msgdata.target == "/streaming/touchcontrols/showlayoutv2") {
                        clearTimeout(paddingMsgTimeoutId);
                    } else if (msgdata.target == "/streaming/touchcontrols/showtitledefault") {

                        if (!canShowOC) {
                            clearTimeout(paddingMsgTimeoutId);
                        } else {
                            if (msgdata.pluginHookMessage !== true) {
                                clearTimeout(paddingMsgTimeoutId);
                                paddingMsgTimeoutId = setTimeout(() => {
                                    dc.dispatchEvent(new MessageEvent('message', {
                                        data: '{"content":"{\\"layoutId\\":\\"\\"}","target":"/streaming/touchcontrols/showlayoutv2","type":"Message","pluginHookMessage":true}'
                                    }));
                                }, 1000);
                            }
                        }
                    }
                }
            });
        }
        return dc;
    }
}
function exitGame() {
    letmeOb = true;
    StreamStats.stop();
    bindmslogoevent();
    const $quickBar = document.querySelector('.better-xcloud-quick-settings-bar');
    if ($quickBar) {
        $quickBar.style.display = 'none';
    }
    document.documentElement.style.overflowY = "";
    if (autoFullScreen == 1) {
        exitMachineFullscreen();
    }
    if (noPopSetting == 0) {
        $('#popSetting').css('display', 'block');
    }
}

let needrefresh = 0;
function initSettingBox() {


    let dom = '';
    dom += `<label  style="display: block;text-align:left;"><div   style="display: inline;">Ngôn ngữ game：</div>`;
    dom += `<input type="radio" class="chooseLanguageListener settingsBoxInputRadio" style="outline:none;" name='chooseLanguage' id="chooseLanguageOn" value="1" ${chooseLanguage == 1 ? 'checked' : ''}><label for="chooseLanguageOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="chooseLanguageListener settingsBoxInputRadio" style="outline:none;" name='chooseLanguage' id="chooseLanguageOff" value="0" ${chooseLanguage == 0 ? 'checked' : ''}><label for="chooseLanguageOff" style="padding-right: 25px;">Tắt</label>`;

    dom += `<label class=" chooseLanguageBlock" style="text-align:left;display:` + (chooseLanguage == 1 ? 'block' : 'none') + `"><div   style="display: inline;">Ngôn ngữ：</div>`;

    Object.keys(default_language_list).forEach(languageChinese => {
        dom += `<input type="radio" class="languageSingleListener settingsBoxInputRadio" style="outline:none;" name='selectLanguage' id="${default_language_list[languageChinese]}" value="${default_language_list[languageChinese]}" ${xcloud_game_language == default_language_list[languageChinese] ? 'checked' : ''}><label for="${default_language_list[languageChinese]}" style="padding-right: 15px;">${languageChinese}</label>`;
    });
    dom += `</label>`;

    dom += `</label>`;

    dom += `<label class=" IfErrUsedefaultGameLanguageBlock" style="display:` + (xcloud_game_language == 'Auto' ? 'block' : 'none') + `;text-align:left;"><div   style="display: inline;">Sử dụng khi lỗi intellisense：</div>`;
    dom += `<input type="radio" style="outline:none;" name='IfErrUsedefaultGameLanguage' class="IfErrUsedefaultGameLanguageListener settingsBoxInputRadio" id="IfErrUsedefaultGameLanguageCN" value="zh-CN" ${IfErrUsedefaultGameLanguage == 'zh-CN' ? 'checked' : ''}><label for="IfErrUsedefaultGameLanguageCN" style="padding-right: 15px;">giản thể</label>`;
    dom += `<input type="radio" style="outline:none;" name='IfErrUsedefaultGameLanguage' class="IfErrUsedefaultGameLanguageListener settingsBoxInputRadio" id="IfErrUsedefaultGameLanguageTW" value="zh-TW" ${IfErrUsedefaultGameLanguage == 'zh-TW' ? 'checked' : ''}><label for="IfErrUsedefaultGameLanguageTW" style="padding-right: 15px;">truyền thống</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Giả mạo IP：</div>`;
    dom += `<input type="radio" class='noNeedVpnListener settingsBoxInputRadio' style="outline:none;" name='noNeedVpn' id="noNeedVpnOpen" value="1" ${no_need_VPN_play == 1 ? 'checked' : ''}><label for="noNeedVpnOpen" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class='noNeedVpnListener settingsBoxInputRadio' style="outline:none;" name='noNeedVpn' id="noNeedVpnOff" value="0" ${no_need_VPN_play == 0 ? 'checked' : ''}><label for="noNeedVpnOff" style="padding-right: 15px;">Tắt</label>`;
    dom += `</label>`;

    dom += `<label class=" chooseRegionsBlock" style="text-align:left;display:` + (no_need_VPN_play == 1 ? 'block' : 'none') + `"><div   style="display: inline;">IP：</div>`;

    Object.keys(regionsList).forEach(region => {
        dom += `<input type="radio" class="regionSingleListener settingsBoxInputRadio" style="outline:none;" name='selectRegion' id="${region}" value="${regionsList[region]}" ${fakeIp == regionsList[region] ? 'checked' : ''}><label for="${region}" style="padding-right: 15px;">${region}</label>`;
    });
    dom += `<div style="display:block">`
    dom += `<input type="radio" class="regionSingleListener settingsBoxInputRadio" style="outline:none;" name='selectRegion' id="customfakeIp" value="customfakeIp" ${useCustomfakeIp == 1 ? 'checked' : ''}><label for="customfakeIp" style="padding-right: 15px;">IP tùy chỉnh：</label>`;

    dom += `<input type='text' style="display: ` + (useCustomfakeIp == 1 ? 'inline' : 'none') + `;outline: none;width: 125px;" id="customfakeIpInput" class="customfakeIpListener" value="${customfakeIp}" placeholder="Nhập IP"/>`
    dom += `</div>`
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Độ nét Và FPS：</div>`;
    dom += `<input type="radio" class="high_bitrateListener settingsBoxInputRadio" style="outline:none;" name='highBitrate' id="high_bitrateOn" value="1" ${high_bitrate == 1 ? 'checked' : ''}><label for="high_bitrateOn" style="padding-right: 15px;">1080P 60FPS(Đẹp hơn)</label>`;
    dom += `<input type="radio" class="high_bitrateListener settingsBoxInputRadio" style="outline:none;" name='highBitrate' id="high_bitrateOff" value="0" ${high_bitrate == 0 ? 'checked' : ''}><label for="high_bitrateOff" style="padding-right: 25px;">720P 60FPS(Mượt Hơn)</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Tắt cảnh báo mạng：</div>`;
    dom += `<input type="radio" class="disableCheckNetworkListener settingsBoxInputRadio" style="outline:none;" name='disableCheckNetwork' id="disableCheckNetworkOn" value="1" ${disableCheckNetwork == 1 ? 'checked' : ''}><label for="disableCheckNetworkOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="disableCheckNetworkListener settingsBoxInputRadio" style="outline:none;" name='disableCheckNetwork' id="disableCheckNetworkOff" value="0" ${disableCheckNetwork == 0 ? 'checked' : ''}><label for="disableCheckNetworkOff" style="padding-right: 25px;">Tắt</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Phím ảo Cảm ứng：</div>`;
    dom += `<input type="radio" class="autoOpenOCListener settingsBoxInputRadio" style="outline:none;" name='autoOpenOC' id="autoOpenOCOn" value="1" ${autoOpenOC == 1 ? 'checked' : ''}><label for="autoOpenOCOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="autoOpenOCListener settingsBoxInputRadio" style="outline:none;" name='autoOpenOC' id="autoOpenOCOff" value="0" ${autoOpenOC == 0 ? 'checked' : ''}><label for="autoOpenOCOff" style="padding-right: 25px;">Tắt</label>`;
    dom += `<div id="autoShowTouchBox" style="padding-right: 0px;display: ${autoOpenOC == 1 ? 'inline' : 'none'}"><input type="checkbox" class="autoShowTouchListener settingsBoxInputRadio" style="outline:none;" name='autoShowTouch' id="autoShowTouch" ${autoShowTouch == true ? 'checked' : ''}><label for="autoShowTouch">tự động bật lên</label></div>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Chặn Phím ảo(yêu cầu tay cầm để chơi)：</div>`;
    dom += `<input type="radio" class="disableTouchControlsListener settingsBoxInputRadio" style="outline:none;" name='disableTouchControls' id="disableTouchControlsOn" value="1" ${disableTouchControls == 1 ? 'checked' : ''}><label for="disableTouchControlsOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="disableTouchControlsListener settingsBoxInputRadio" style="outline:none;" name='disableTouchControls' id="disableTouchControlsOff" value="0" ${disableTouchControls == 0 ? 'checked' : ''}><label for="disableTouchControlsOff" style="padding-right: 25px;">Tắt</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Tự động Full Màn：</div>`;
    dom += `<input type="radio" class="autoFullScreenListener settingsBoxInputRadio" style="outline:none;" name='autoFullScreen' id="autoFullScreenOn" value="1" ${autoFullScreen == 1 ? 'checked' : ''}><label for="autoFullScreenOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="autoFullScreenListener settingsBoxInputRadio" style="outline:none;" name='autoFullScreen' id="autoFullScreenOff" value="0" ${autoFullScreen == 0 ? 'checked' : ''}><label for="autoFullScreenOff" style="padding-right: 25px;">Tắt</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Chọn máy chủ：</div>`;
    dom += `<input type="radio" class="blockXcloudServerListener settingsBoxInputRadio" style="outline:none;" name='blockXcloudServer' id="blockXcloudServerOn" value="1" ${blockXcloudServer == 1 ? 'checked' : ''}><label for="blockXcloudServerOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="blockXcloudServerListener settingsBoxInputRadio" style="outline:none;" name='blockXcloudServer' id="blockXcloudServerOff" value="0" ${blockXcloudServer == 0 ? 'checked' : ''}><label for="blockXcloudServerOff" style="padding-right: 25px;">Tắt</label>`;

    dom += `<select class="blockServerBlock" style="outline: none;display:` + (blockXcloudServer == 1 ? 'block' : 'none') + `">`;
    dom += `<option style="display:none"></option>`
    blockXcloudServerList.forEach(serverName => {
        dom += `<option value="${serverName}" ${defaultXcloudServer == serverName ? 'selected' : ''}>${serverName}</option>`;
    });
    dom += `</select>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Treo Game：</div>`;
    dom += `<input type="radio" class="antiKickListener settingsBoxInputRadio" style="outline:none;" name='antiKick' id="antiKickOn" value="1" ${antiKick == 1 ? 'checked' : ''}><label for="antiKickOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="antiKickListener settingsBoxInputRadio" style="outline:none;" name='antiKick' id="antiKickOff" value="0" ${antiKick == 0 ? 'checked' : ''}><label for="antiKickOff" style="padding-right: 25px;">Tắt</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Nút setting：</div>`;
    dom += `<input type="radio" class="noPopSettingListener settingsBoxInputRadio" style="outline:none;" name='noPopSetting' id="noPopSettingOn" value="0" ${noPopSetting == 0 ? 'checked' : ''}><label for="noPopSettingOn" style="padding-right: 15px;">Hiện</label>`;
    dom += `<input type="radio" class="noPopSettingListener settingsBoxInputRadio" style="outline:none;" name='noPopSetting' id="noPopSettingOff" value="1" ${noPopSetting == 1 ? 'checked' : ''}><label for="noPopSettingOff" style="padding-right: 25px;">ẩn</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<button class="closeSetting1 closeSetting2" style="outline: none;">Đóng</button>`

    dom+=`<div style="text-align: left;margin-top: 8px;font-size: 16px;"><lable>Việt Hoá By：</lable><a style="margin-right:15px;outline: none;color: #2f82f7;text-decoration: underline;" href="https://www.facebook.com/Doan7457">Đoàn Nguyễn</a></a><a </div>`
    dom+=`<div style="text-align: left;margin-top: 8px;font-size: 16px;"><lable>Mua XboxCloud Tại ZALO：</lable><a style="margin-right:15px;outline: none;color: #2f82f7;text-decoration: underline;" href="https://www.facebook.com/Doan7457">0389940355</a></a><a </div>`
    dom+=`<div style="text-align: left;margin-top: 8px;font-size: 16px;"><lable>Hỗ Trợ Việt Hoá : Kênh Youtube:</lable><a style="margin-right:15px;outline: none;color: #ff424c;text-decoration: underline;" href="https://www.youtube.com/channel/UCxRnbvxANiOzYMs8qBpcJwg">XboxCloud Việt Nam</a></a><a </div>`
    dom+=`<div style="text-align: left;margin-top: 8px;font-size: 16px;"><lable>Donate Tác giả：</lable><a style="margin-right:15px;outline: none;color: #00b038;text-decoration: underline;" href="https://raw.githubusercontent.com/Doann7457/7457/main/PNG/wechat.png">Wechat</a></a><a </div>`
    dom = '<div style="padding: 20px;color: black;display:none;" class="settingsBackgroud" id=\'settingsBackgroud\'>' +`<div class="settingsBox">`+dom+`</div>`+ '</div>';

    $('body').append(dom);

    $(document).on('click', '.antiKickListener', function () {
        needrefresh = 1;
        naifeitian.setValue('antiKickGM', $(this).val());
        $('.closeSetting1').text('Lưu');
    });
    $(document).on('change', '.autoShowTouchListener', function () {
        let newVal = $(this).attr('checked') == 'checked';
        if (newVal) {
            $(this).removeAttr('checked');
        } else {
            $(this).attr('checked');
        }
        naifeitian.setValue('autoShowTouchGM', !newVal);
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.disableTouchControlsListener', function () {
        if ($(this).val() == 1) {
            if (!confirm("Bạn có chắc chắn muốn chặn Phím ảo ?")) {
                $('#disableTouchControlsOff').click();
                return;
            }
        }
        needrefresh = 1;
        naifeitian.setValue('disableTouchControlsGM', $(this).val());
        $('.closeSetting1').text('Lưu');
    });
    $(document).on('click', '.noPopSettingListener', function () {
        naifeitian.setValue('noPopSettingGM', $(this).val());
        noPopSetting = $(this).val();
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.closeSetting1', function () {

        $('#settingsBackgroud').css('display', 'none');
        if (needrefresh == 1) {
            history.go(0);
        }
    });

    $(document).on('click', '.chooseLanguageListener', function () {
        if ($(this).val() == 0) {
            $('.chooseLanguageBlock').css('display', 'none');
            $('.IfErrUsedefaultGameLanguageBlock').css('display', 'none');
        } else {
            $('.chooseLanguageBlock').css('display', 'block');

            if (naifeitian.getValue('xcloud_game_languageGM') == 'Auto') {
                $('.IfErrUsedefaultGameLanguageBlock').css('display', 'block');
            }
        }
        naifeitian.setValue('chooseLanguageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.languageSingleListener', function () {
        if ($(this).val() != 'Auto') {
            $('.IfErrUsedefaultGameLanguageBlock').css('display', 'none');
        } else {
            $('.IfErrUsedefaultGameLanguageBlock').css('display', 'block');
        }
        naifeitian.setValue('xcloud_game_languageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('LưuLưu');
    });

    $(document).on('click', '.IfErrUsedefaultGameLanguageListener', function () {
        naifeitian.setValue('IfErrUsedefaultGameLanguageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.noNeedVpnListener', function () {
        if ($(this).val() == 0) {
            $('.chooseRegionsBlock').css('display', 'none');;
        } else {
            $('.chooseRegionsBlock').css('display', 'block');
        }
        naifeitian.setValue('no_need_VPN_playGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.regionSingleListener', function () {
        if ($(this).val() == 'customfakeIp') {
            naifeitian.setValue('useCustomfakeIpGM', 1);
            $('#customfakeIpInput').css('display', 'inline');
        } else {
            naifeitian.setValue('fakeIpGM', $(this).val());
            naifeitian.setValue('useCustomfakeIpGM', 0);
            $('#customfakeIpInput').css('display', 'none');
        }
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('blur', '.customfakeIpListener', function () {
        if (naifeitian.isValidIP($(this).val())) {
            naifeitian.setValue('customfakeIpGM', $(this).val());
        } else {
            $(this).val("");
            naifeitian.setValue('customfakeIpGM', '');
            alert('IP格式错误！');
        }
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.high_bitrateListener', function () {
        naifeitian.setValue('high_bitrateGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.autoFullScreenListener', function () {
        naifeitian.setValue('autoFullScreenGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.disableCheckNetworkListener', function () {
        naifeitian.setValue('disableCheckNetworkGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.autoOpenOCListener', function () {

        if ($(this).val() == 0) {
            $('#autoShowTouchBox').css('display', 'none');
        } else {
            $('#autoShowTouchBox').css('display', 'inline');
        }

        naifeitian.setValue('autoOpenOCGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('click', '.blockXcloudServerListener', function () {
        if ($(this).val() == 0) {
            $('.blockServerBlock').css('display', 'none');
        } else {
            $('.blockServerBlock').css('display', 'block');
        }
        naifeitian.setValue('blockXcloudServerGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });

    $(document).on('change', '.blockServerBlock', function () {
        naifeitian.setValue('defaultXcloudServerGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu');
    });
}

$(document).ready(function () {
    setTimeout(function () {
        let popCss = `

#popSetting {
width: 76px;
height: 33px;
background: #fff;
position: absolute;
  top: 30%;
  cursor: pointer;
box-sizing: border-box;
background-size: 100% 100%;
overflow: hidden;
  font-family: Arial;
font-size: 18px;
line-height: 30px;
font-weight: bold;
color: #000000bf;
border: 2px solid;
border-radius: 10px;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none ;
}
.better-xcloud-hidden {
  visibility: hidden !important;
}

.better-xcloud-stats-bar {
  display: block;
  user-select: none;
  position: fixed;
  top: 0;
  background-color: #000;
  color: #fff;
  font-family: Consolas, "Courier New", Courier, monospace;
  font-size: 0.9rem;
  padding-left: 8px;
  z-index: 1000;
  text-wrap: nowrap;
}

.better-xcloud-stats-bar[data-position=top-left] {
  left: 20px;
}

.better-xcloud-stats-bar[data-position=top-right] {
  right: 0;
}

.better-xcloud-stats-bar[data-position=top-center] {
  transform: translate(-50%, 0);
  left: 50%;
}

.better-xcloud-stats-bar[data-transparent=true] {
  background: none;
  filter: drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000);
}

.better-xcloud-stats-bar label {
  margin: 0 8px 0 0;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  font-size: inherit;
  font-weight: bold;
  vertical-align: middle;
}

.better-xcloud-stats-bar span {
  min-width: 60px;
  display: inline-block;
  text-align: right;
  padding-right: 8px;
  margin-right: 8px;
  border-right: 2px solid #fff;
  vertical-align: middle;
}

.better-xcloud-stats-bar span[data-grade=good] {
  color: #6bffff;
}

.better-xcloud-stats-bar span[data-grade=ok] {
  color: #fff16b;
}

.better-xcloud-stats-bar span[data-grade=bad] {
  color: #ff5f5f;
}

.better-xcloud-stats-bar span:first-of-type {
  min-width: 30px;
}

.better-xcloud-stats-bar span:last-of-type {
  border: 0;
  margin-right: 0;
}

.better-xcloud-stats-settings {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 420px;
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  background: #1a1b1e;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  font-family: "Segoe UI", Arial, Helvetica, sans-serif;
  box-shadow: 0 0 6px #000;
  user-select: none;
}

.better-xcloud-stats-settings *:focus {
  outline: none !important;
}

.better-xcloud-stats-settings > b {
  color: #fff;
  display: block;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 32px;
  margin-bottom: 12px;
}

.better-xcloud-stats-settings > div {
  display: flex;
  margin-bottom: 8px;
  padding: 2px 4px;
}

.better-xcloud-stats-settings label {
  flex: 1;
  margin-bottom: 0;
  align-self: center;
}

.better-xcloud-stats-settings button {
  padding: 8px 32px;
  margin: 20px auto 0;
  border: none;
  border-radius: 4px;
  display: block;
  background-color: #2d3036;
  text-align: center;
  color: white;
  text-transform: uppercase;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: 18px;
  font-size: 14px;
}

@media (hover: hover) {
  .better-xcloud-stats-settings button:hover {
      background-color: #515863;
  }
}

.better-xcloud-stats-settings button:focus {
  background-color: #515863;
}

.better-xcloud-gone {
  display: none !important;
}

.better-xcloud-quick-settings-bar {
  display: none;
  user-select: none;
  -webkit-user-select: none;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 9999;
  padding: 16px;
  width: 600px;
  background: #1a1b1e;
  color: #fff;
  border-radius: 8px 8px 0 0;
  font-weight: 400;
  font-size: 14px;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  text-align: center;
  box-shadow: 0px 0px 6px #000;
  opacity: 0.95;
}

.better-xcloud-quick-settings-bar *:focus {
  outline: none !important;
}

.better-xcloud-quick-settings-bar > div {
  flex: 1;
}

.better-xcloud-quick-settings-bar label {
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
}

.better-xcloud-quick-settings-bar input {
  width: 22px;
  height: 22px;
}

.better-xcloud-quick-settings-bar button {
  border: none;
  width: 22px;
  height: 22px;
  margin: 0 4px;
  line-height: 22px;
  background-color: #515151;
  color: #fff;
  border-radius: 4px;
}

@media (hover: hover) {
  .better-xcloud-quick-settings-bar button:hover {
      background-color: #414141;
      color: white;
  }
}

.better-xcloud-quick-settings-bar button:active {
      background-color: #414141;
      color: white;
  }

.better-xcloud-quick-settings-bar span {
  display: inline-block;
  width: 40px;
  font-weight: bold;
  font-family: Consolas, "Courier New", Courier, monospace;
}
#game-stream video {
  visibility: hidden;
}

.closeSetting1 {
    color: #0099CC;
    background: transparent;
    border: 2px solid #0099CC;
    border-radius: 6px;
    border: none;
    color: white;
    padding: 3px 13px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;
   }
    .closeSetting2 {
    background-color: white;
    color: black;
    border: 2px solid #008CBA;
    display: block;
    margin: 0 auto;
    margin-top: 5px;
   }
  .closeSetting2:hover {
    background-color: #008CBA;
    color: white;
   }
  .settingsBackgroud{
      position: fixed;
      left: 0px;
      top: 3%;
      background: #0000;
      width: 100%;
      height: 100%;
              overflow: scroll;
    }
    .settingsBox{
      position: relative;
      background: wheat;
      width: fit-content;
              height: fit-content;
      border-radius: 5px;
      margin: 5% auto;
              padding: 20px;
              font-family: '微软雅黑';
              line-height: 22px;
    }
         .settingsBoxInputRadio{
              background-color: initial;
              cursor: default;
              appearance: auto;
              box-sizing: border-box;
              margin: 3px 3px 0px 5px;
              padding: initial;
              padding-top: initial;
              padding-right: initial;
              padding-bottom: initial;
              padding-left: initial;
              border: initial;
              -webkit-appearance: checkbox;
              accent-color: dodgerblue;
          }

          #StreamHud >div{
      background-color:rgba(255,0,0,0)!important;
      }

      #StreamHud >button{
      background-color:rgba(0,0,0,0)!important;
      }
      #StreamHud >button > div{
      opacity:0.3!important;
      }
`;

        if (disableTouchControls == 1) {
            popCss += `
#MultiTouchSurface, #BabylonCanvasContainer-main {
  display: none !important;
}
`};

        let xfbasicStyle = document.createElement('style');
        xfbasicStyle.innerHTML = popCss;
        let docxf = document.head || document.documentElement;
        docxf.appendChild(xfbasicStyle);
        if (noPopSetting == 0) {
            $('body').append(`<div id="popSetting" style="display:block">Hiện⚙️</div>`);
            $(document).on('click', '#popSetting', function () {
                $('#settingsBackgroud').css('display', '');
            });
        }
        initSettingBox();
        updateVideoPlayerCss();
        StreamStats.render();
        setupVideoSettingsBar();
    }, 2000);

});

let timer;
let mousehidding = false;
$(document).mousemove(function () {
    if (mousehidding) {
        mousehidding = false;
        return;
    }
    if (timer) {
        clearTimeout(timer);
        timer = 0;
    }
    $('html').css({
        cursor: ''
    });
    timer = setTimeout(function () {
        mousehidding = true;
        $('html').css({
            cursor: 'none'
        });
    }, 2000);
});

$(window).on('popstate', function () {
    exitGame();
});

let _pushState = window.history.pushState;
window.history.pushState = function () {
    if (noPopSetting == 0) {
        if (arguments[2].substring(arguments[2].length, arguments[2].length - 5) == '/play') {
            $('#popSetting').css('display', 'block');

        } else {
            $('#popSetting').css('display', 'none');
        }
    }
    exitGame();
    return _pushState.apply(this, arguments);
}

window.onpopstate = function (event) {
    if (event.state) {
        if (window.location.href.slice(-5) == '/play') {
            exitGame();
        }
    }
};


RTCPeerConnection.prototype.orgAddIceCandidate = RTCPeerConnection.prototype.addIceCandidate;
RTCPeerConnection.prototype.addIceCandidate = function (...args) {

    STREAM_WEBRTC = this;
    return this.orgAddIceCandidate.apply(this, args);
}

function getVideoPlayerFilterStyle() {
    const filters = [];

    const clarity = VIDEO_CLARITY['default'];
    if (clarity != 0) {
        const level = 7 - (clarity - 1); // 5,6,7
        const matrix = `0 -1 0 -1 ${level} -1 0 -1 0`;
        document.getElementById('better-xcloud-filter-clarity-matrix').setAttributeNS(null, 'kernelMatrix', matrix);

        filters.push(`url(#better-xcloud-filter-clarity)`);
    }

    const saturation = VIDEO_SATURATION['default'];
    if (saturation != 100) {
        filters.push(`saturate(${saturation}%)`);
    }

    const contrast = VIDEO_CONTRAST['default'];
    if (contrast != 100) {
        filters.push(`contrast(${contrast}%)`);
    }

    const brightness = VIDEO_BRIGHTNESS['default'];
    if (brightness != 100) {
        filters.push(`brightness(${brightness}%)`);
    }

    return filters.join(' ');
}


function updateVideoPlayerCss() {
    let $elm = document.getElementById('better-xcloud-video-css');
    if (!$elm) {
        const CE = createElement;

        $elm = CE('style', { id: 'better-xcloud-video-css' });
        document.documentElement.appendChild($elm);

        // Setup SVG filters
        const $svg = CE('svg', {
            'id': 'better-xcloud-video-filters',
            'xmlns': 'http://www.w3.org/2000/svg',
            'class': 'better-xcloud-gone',
        }, CE('defs', { 'xmlns': 'http://www.w3.org/2000/svg' },
              CE('filter', { 'id': 'better-xcloud-filter-clarity', 'xmlns': 'http://www.w3.org/2000/svg' },
                 CE('feConvolveMatrix', { 'id': 'better-xcloud-filter-clarity-matrix', 'order': '3', 'xmlns': 'http://www.w3.org/2000/svg' }))
             )
                       );
        document.documentElement.appendChild($svg);
    }

    let filters = getVideoPlayerFilterStyle();
    let css = '';
    if (filters) {
        css += `filter: ${filters} !important;`;
    }

    if (video_stretch.default == 'fill') {
        css += 'object-fit: fill !important;';
    }

    if (video_stretch.default == 'setting') {
        css += `transform: scaleX(` + (video_stretch_x_y.x * 1 + 1) + `) scaleY(` + (video_stretch_x_y.y * 1 + 1) + `) !important;`;
    }

    if (css) {
        css = `#game-stream video {${css}}`;
    }

    $elm.textContent = css;
}
function injectVideoSettingsButton() {
    const $screen = document.querySelector('#PageContent section[class*=PureScreens]');
    if (!$screen) {
        return;
    }

    if ($screen.xObserving) {
        return;
    }

    $screen.xObserving = true;
    const $quickBar = document.querySelector('.better-xcloud-quick-settings-bar');
    const $parent = $screen.parentElement;
    const hideQuickBarFunc = e => {
        e.stopPropagation();
        if (e.target != $parent && e.target.id !== 'MultiTouchSurface' && !e.target.querySelector('#BabylonCanvasContainer-main')) {
            return;
        }

        // Hide Quick settings bar
        $quickBar.style.display = 'none';

        $parent.removeEventListener('click', hideQuickBarFunc);
        $parent.removeEventListener('touchstart', hideQuickBarFunc);

        if (e.target.id === 'MultiTouchSurface') {
            e.target.removeEventListener('touchstart', hideQuickBarFunc);
        }
    }
    const observer = new MutationObserver(mutationList => {
        mutationList.forEach(item => {
            if (item.type !== 'childList') {
                return;
            }

            item.addedNodes.forEach(async node => {
                if (!node.className || !node.className.startsWith('StreamMenu')) {
                    return;
                }

                const $orgButton = node.querySelector('div > div > button');
                if (!$orgButton) {
                    return;
                }

                // Create Video Settings button
                const $btnVideoSettings = cloneStreamMenuButton($orgButton, 'Điều chỉnh video Game', ICON_VIDEO_SETTINGS);
                $btnVideoSettings.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close HUD
                    $btnCloseHud.click();

                    // Show Quick settings bar
                    $quickBar.style.display = 'flex';

                    $parent.addEventListener('click', hideQuickBarFunc);
                    $parent.addEventListener('touchstart', hideQuickBarFunc);

                    const $touchSurface = document.getElementById('MultiTouchSurface');
                    $touchSurface && $touchSurface.style.display != 'none' && $touchSurface.addEventListener('touchstart', hideQuickBarFunc);
                });
                // Add button at the beginning
                $orgButton.parentElement.insertBefore($btnVideoSettings, $orgButton.parentElement.firstChild);

                // Hide Quick bar when closing HUD
                const $btnCloseHud = document.querySelector('button[class*=StreamMenu-module__backButton]');
                $btnCloseHud.addEventListener('click', e => {
                    $quickBar.style.display = 'none';
                });

                // Create Stream Stats button
                const $btnStreamStats = cloneStreamMenuButton($orgButton, 'Hiện thông số Truyền tải', ICON_STREAM_STATS);
                $btnStreamStats.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle Stream Stats
                    StreamStats.toggle();
                });

                // Insert after Video Settings button
                $orgButton.parentElement.insertBefore($btnStreamStats, $btnVideoSettings);

            });
        });
    });
    observer.observe($screen, { subtree: true, childList: true });
}


function patchVideoApi() {

    // Show video player when it's ready
    let showFunc;
    showFunc = function () {
        this.style.visibility = 'visible';
        this.removeEventListener('playing', showFunc);

        if (!this.videoWidth) {
            return;
        }

        STREAM_WEBRTC.getStats().then(stats => {

            if (STATS_SHOW_WHEN_PLAYING['default']) {
                StreamStats.start();
            }
        });
    }
    HTMLMediaElement.prototype.orgPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {

        //         if ( this.className.startsWith('XboxSplashVideo')) {
        //             this.volume = 0;
        //             this.style.display = 'none';
        //             this.dispatchEvent(new Event('ended'));

        //             return {
        //                 catch: () => {},
        //             };
        //         }

        if (letmeOb && antiKick == 1) {
            const divElement = $('div[data-testid="ui-container"]')[0];
            const observer = new MutationObserver(function (mutations) {
                try {
                    mutations.forEach(function (mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function (addedNode) {
                                let btn=$(addedNode).find('button[data-auto-focus="true"]');
                                if ($(btn).length > 0 && btn.parent().children().length==1) {
                                    $(btn).click();
                                    throw new Error("巴啦啦能量－呼尼拉－魔仙变身！");
                                }
                            });
                        }
                    });
                } catch (e) { }
            });

            setTimeout(() => {
                observer.observe(divElement, { childList: true, subtree: true });
                console.log('antiKick已部署');
            }, 1000 * 20);
            letmeOb = false;
        }

        this.addEventListener('playing', showFunc);
        injectVideoSettingsButton();

        return this.orgPlay.apply(this);
    };
}

patchVideoApi();

let mslogotimeOut = 0;
function mslogoClickevent(mslogoInterval, s) {
    let mslogodom = $($('header>div>div>button')[1]);
    if (mslogodom.length > 0) {
        clearInterval(mslogoInterval);
        mslogodom = mslogodom.next();
        if (mslogodom.text() == ("⚙️ cài đặt" + nftxboxversion)) { return; }
        mslogodom.removeAttr('href');
        mslogodom.css("color", 'white');
        mslogodom.text("⚙️ cài đặt" + nftxboxversion);
        mslogodom.click(() => {
            $('#settingsBackgroud').css('display', '');
        });
        setTimeout(() => { mslogoClickevent(mslogoInterval) }, 5000);
    }
    mslogotimeOut = mslogotimeOut + 1;
    if (mslogotimeOut > 10) {
        mslogotimeOut = 0;
        clearInterval(mslogoInterval);
    }
}
let mslogoInterval = setInterval(() => {
    mslogoClickevent(mslogoInterval, 3000);
}, 1000);


function bindmslogoevent() {
    let divElement = $('#gamepass-root > div > div');
    if (divElement.length < 1) {
        setTimeout(() => {
            bindmslogoevent();
        }, 2333);
        return;
    }
    divElement = divElement.get(0);
    let mslogodom = $(divElement).children('header').find('a[href]');
    if (mslogodom.length > 1) { mslogodom = $(mslogodom.get(0)); }
    if (mslogodom.text() == ("⚙️ cài đặt" + nftxboxversion)) { return; }
    mslogodom.removeAttr('href');
    mslogodom.css("color", 'white');
    mslogodom.text("⚙️ cài đặt" + nftxboxversion);
    mslogodom.click(() => {
        $('#settingsBackgroud').css('display', '');
    });
    setTimeout(() => { bindmslogoevent() }, 5000);
}

bindmslogoevent();

console.log("all done");
})();
