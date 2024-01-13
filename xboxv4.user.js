// ==UserScript==
// @name                 Xbox TOOL By Xbox Cloud Viet Nam v4.0
// @name:zh-CN           Xbox TOOL By Xbox Cloud Viet Nam v4.0
// @namespace            http://tampermonkey.net/xbox/nft
// @version              4.0
// @author               (Nephalem) Việt hoá Kênh Youtube Xbox Cloud Việt Nam
// @match                https://www.xbox.com/*/play*
// @run-at               document-start
// @grant                unsafeWindow
// @require              https://raw.githubusercontent.com/Doann7457/xcloud/main0/v3/jquery.min.js
// @original-script      1
// @description:zh-cn    Việt hoá bởi Nguyễn Văn Đoàn. Kênh Youtube Xbox Cloud Việt Nam.  Zalo 0389940355
// @description          Việt hoá bởi Nguyễn Văn Đoàn. Kênh Youtube Xbox Cloud Việt Nam.  Zalo 0389940355
// @downloadURL none
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    let nftxboxversion = 'v4';
    //========↓↓↓↓↓ là cài đặt ban đầu của từng chức năng, chỉ có hiệu lực khi chạy script lần đầu tiên↓↓↓↓↓==========//
    //★★ 1=bật 0=tắt ★★//

    //免代理直连
    let no_need_VPN_play = 1;

    let regionsList = { 'Korea': '168.126.63.1', 'US': '4.2.2.2', 'Japan': '210.131.113.123' }

    //欺骗IP
    let fakeIp = regionsList['US'];

    //选择语言
    let chooseLanguage = 0;
    //智能语言报错时默认使用的语言，简体zh-CN，繁体zh-TW，总开关是上一行的chooseLanguage
    let IfErrUsedefaultGameLanguage = 'zh-CN';

    //Tốc độ bit cao, lên tới 8M sau khi tắt, tốc độ bit chất lượng hình ảnh 720P
    let high_bitrate = 1;

    //使用触屏经典手柄布局(默认关闭)
    let useDefaultTouchControls = 1;

    //禁止检测网络状况
    let disableCheckNetwork = 1;

    //自动全屏
    let autoFullScreen = 1;

    //锁定云游戏服务器，注意此项并非是云游戏区域(默认关闭)
    let blockXcloudServer = 1;
    let blockXcloudServerList = ['AustraliaEast', 'AustraliaSouthEast', 'BrazilSouth', 'EastUS', 'EastUS2', 'JapanEast', 'KoreaCentral', 'NorthCentralUs', 'SouthCentralUS', 'UKSouth', 'WestEurope', 'WestUS', 'WestUS2'];
    let defaultXcloudServer = 'KoreaCentral';

    //画面设置
    let videoResize = 0;
    //左右
    let videoX=0.24;
    //上下
    let videoY = 0;


    let STATS_SHOW_WHEN_PLAYING={"default":false,"name":"STATS_SHOW_WHEN_PLAYINGGM"};

    let STATS_POSITION={'default':'top-left','options':{'top-left': 'Góc Trái','top-center': 'Giữa','top-right': 'Góc Phải'},'name':'STATS_POSITIONGM'}

    let STATS_TRANSPARENT={"default":false,"name":"STATS_TRANSPARENTGM"};
    let STATS_OPACITY={
        'default': 80,
        'min': 10,
        'max': 100,
        'name':'STATS_OPACITYGM'
    };

    let STATS_TEXT_SIZE={
        'default':'0.9rem',
        'options':{
            '0.7rem': 'Nhỏ',
            '1.0rem': 'Vừa',
            '1.7rem': 'Lớn',
        },
        'name':'STATS_TEXT_SIZEGM'}

    let STATS_CONDITIONAL_FORMATTING={"default":false,"name":"STATS_CONDITIONAL_FORMATTINGGM"};;

    //========↑↑↑↑↑是各个功能的初始设置，仅第一次运行脚本有效↑↑↑↑↑========//

    const originFetch = fetch;
    let regionsMenuItemList = [];
    let languageMenuItemList = [];
    let default_language_list = {'智能简繁': 'Auto', '简体': 'zh-CN', '繁体': 'zh-TW'}
    let xcloud_game_language = default_language_list['简体'];//
    let useCustomfakeIp = 0;
    let customfakeIp = '';
    let BasicControlsCheck = false;
    var STREAM_WEBRTC;
    const ICON_STREAM_STATS = '<path d="M12.005 5C9.184 5 6.749 6.416 5.009 7.903c-.87.743-1.571 1.51-2.074 2.18-.251.335-.452.644-.605.934-.434.733-.389 1.314-.004 1.98a6.98 6.98 0 0 0 .609.949 13.62 13.62 0 0 0 2.076 2.182C6.753 17.606 9.188 19 12.005 19s5.252-1.394 6.994-2.873a13.62 13.62 0 0 0 2.076-2.182 6.98 6.98 0 0 0 .609-.949c.425-.737.364-1.343-.004-1.98-.154-.29-.354-.599-.605-.934-.503-.669-1.204-1.436-2.074-2.18C17.261 6.416 14.826 5 12.005 5zm0 2c2.135 0 4.189 1.135 5.697 2.424.754.644 1.368 1.32 1.773 1.859.203.27.354.509.351.733s-.151.462-.353.732c-.404.541-1.016 1.214-1.77 1.854C16.198 15.881 14.145 17 12.005 17s-4.193-1.12-5.699-2.398a11.8 11.8 0 0 1-1.77-1.854c-.202-.27-.351-.508-.353-.732s.149-.463.351-.733c.406-.54 1.019-1.215 1.773-1.859C7.816 8.135 9.87 7 12.005 7zm.025 1.975c-1.645 0-3 1.355-3 3s1.355 3 3 3 3-1.355 3-3-1.355-3-3-3zm0 2c.564 0 1 .436 1 1s-.436 1-1 1-1-.436-1-1 .436-1 1-1z"/>';



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
            if (this.isType(value) === 'object' || this.isType(value) === 'array') {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            return localStorage.setItem(key, value);
        },
        isValidIP(ip) {
            var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            return reg.test(ip);
        },
        isNumber(val) {
            return !isNaN(parseFloat(val)) && isFinite(val);
        },
        killTouchMove(v){
            $(v).on('touchmove', false);
        },
        renewTouchMove(v){
            $(v).off('touchmove', false);
        },
        toElement(key, onChange) {
            const CE = createElement;
            const setting = key;
            const currentValue = key['default']==undefined?key:key['default'];

            let $control;
            if (setting['options']!=undefined) {
                $control = CE('select', {id: 'xcloud_setting_' + key['name']});

                for (let value in setting.options) {
                    const label = setting.options[value];

                    const $option = CE('option', {value: value}, label);
                    $control.appendChild($option);
                }

                $control.value = currentValue;
                $control.addEventListener('change', e => {
                    key['default']=e.target.value;

                    this.setValue(key['name'], key);
                    onChange && onChange(e);
                });
            } else if (typeof setting.default === 'number') {
                $control = CE('input', {'type': 'number', 'min': setting.min, 'max': setting.max});

                $control.value = currentValue;
                $control.addEventListener('change', e => {
                    let value = Math.max(setting.min, Math.min(setting.max, parseInt(e.target.value)));
                    e.target.value = value;

                    key['default']=e.target.value
                    this.setValue(key['name'],key );
                    onChange && onChange(e);
                });
            } else {
                $control = CE('input', {'type': 'checkbox'});
                $control.checked = currentValue;

                $control.addEventListener('change', e => {
                    key['default']=e.target.checked
                    this.setValue(key['name'], key);
                    onChange && onChange(e);
                });
            }

            $control.id = `xcloud_setting_${key}`;
            return $control;
        }

    }

    // Quickly create a tree of elements without having to use innerHTML
    function createElement(elmName, props = {}) {
        const $elm = document.createElement(elmName);
        for (let key in props) {
            if (!props.hasOwnProperty(key) || $elm.hasOwnProperty(key)) {
                continue;
            }

            let value = props[key];
            $elm.setAttribute(key, value);
        }

        for (let i = 2, size = arguments.length; i < size; i++) {
            const arg = arguments[i];
            const argType = typeof arg;

            if (argType == 'string' || argType == 'number') {
                $elm.innerText = arg;
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


    blockXcloudServerList = naifeitian.getValue("blockXcloudServerListGM") == null ? blockXcloudServerList : naifeitian.getValue("blockXcloudServerListGM");
    naifeitian.setValue("blockXcloudServerListGM", blockXcloudServerList);

    no_need_VPN_play = naifeitian.getValue("no_need_VPN_playGM") == null ? no_need_VPN_play : naifeitian.getValue("no_need_VPN_playGM");
    naifeitian.setValue("no_need_VPN_playGM", no_need_VPN_play);

    chooseLanguage = naifeitian.getValue("chooseLanguageGM") == null ? chooseLanguage : naifeitian.getValue("chooseLanguageGM");
    naifeitian.setValue("chooseLanguageGM", chooseLanguage);

    IfErrUsedefaultGameLanguage = naifeitian.getValue("IfErrUsedefaultGameLanguageGM") == null ? IfErrUsedefaultGameLanguage : naifeitian.getValue("IfErrUsedefaultGameLanguageGM");
    naifeitian.setValue("IfErrUsedefaultGameLanguageGM", IfErrUsedefaultGameLanguage);

    fakeIp = naifeitian.getValue("fakeIpGM") == null ? fakeIp : naifeitian.getValue("fakeIpGM");
    naifeitian.setValue("fakeIpGM", fakeIp);

    high_bitrate = naifeitian.getValue("high_bitrateGM") == null ? high_bitrate : naifeitian.getValue("high_bitrateGM");
    naifeitian.setValue("high_bitrateGM", high_bitrate);

    useDefaultTouchControls = naifeitian.getValue("useDefaultTouchControlsGM") == null ? useDefaultTouchControls : naifeitian.getValue("useDefaultTouchControlsGM");
    naifeitian.setValue("useDefaultTouchControlsGM", useDefaultTouchControls);

    disableCheckNetwork = naifeitian.getValue("disableCheckNetworkGM") == null ? disableCheckNetwork : naifeitian.getValue("disableCheckNetworkGM");
    naifeitian.setValue("disableCheckNetworkGM", disableCheckNetwork);

    defaultXcloudServer = naifeitian.getValue("defaultXcloudServerGM") == null ? defaultXcloudServer : naifeitian.getValue("defaultXcloudServerGM");
    naifeitian.setValue("defaultXcloudServerGM", defaultXcloudServer);

    blockXcloudServer = naifeitian.getValue("blockXcloudServerGM") == null ? blockXcloudServer : naifeitian.getValue("blockXcloudServerGM");
    naifeitian.setValue("blockXcloudServerGM", blockXcloudServer);

    xcloud_game_language = naifeitian.getValue("xcloud_game_languageGM") == null ? xcloud_game_language : naifeitian.getValue("xcloud_game_languageGM");
    naifeitian.setValue("xcloud_game_languageGM", xcloud_game_language);

    useCustomfakeIp = naifeitian.getValue("useCustomfakeIpGM") == null ? useCustomfakeIp : naifeitian.getValue("useCustomfakeIpGM");
    naifeitian.setValue("useCustomfakeIpGM", useCustomfakeIp);

    customfakeIp = naifeitian.getValue("customfakeIpGM") == null ? customfakeIp : naifeitian.getValue("customfakeIpGM");
    naifeitian.setValue("customfakeIpGM", customfakeIp);

    autoFullScreen = naifeitian.getValue("autoFullScreenGM") == null ? autoFullScreen : naifeitian.getValue("autoFullScreenGM");
    naifeitian.setValue("autoFullScreenGM", autoFullScreen);

    videoResize = naifeitian.getValue("videoResizeGM") == null ? videoResize : naifeitian.getValue("videoResizeGM");
    naifeitian.setValue("videoResizeGM", videoResize);

    videoX = naifeitian.getValue("videoXGM") == null ? videoX : naifeitian.getValue("videoXGM");
    naifeitian.setValue("videoXGM", videoX);

    videoY = naifeitian.getValue("videoYGM") == null ? videoY : naifeitian.getValue("videoYGM");
    naifeitian.setValue("videoYGM", videoY);

    STATS_SHOW_WHEN_PLAYING = naifeitian.getValue("STATS_SHOW_WHEN_PLAYINGGM") == null ? STATS_SHOW_WHEN_PLAYING : naifeitian.getValue("STATS_SHOW_WHEN_PLAYINGGM");
    naifeitian.setValue("STATS_SHOW_WHEN_PLAYINGGM", STATS_SHOW_WHEN_PLAYING);

    STATS_POSITION = naifeitian.getValue("STATS_POSITIONGM") == null ? STATS_POSITION: naifeitian.getValue("STATS_POSITIONGM");
    naifeitian.setValue("STATS_POSITIONGM", STATS_POSITION);

    STATS_TRANSPARENT = naifeitian.getValue("STATS_TRANSPARENTGM") == null ? STATS_TRANSPARENT : naifeitian.getValue("STATS_TRANSPARENTGM");
    naifeitian.setValue("STATS_TRANSPARENTGM", STATS_TRANSPARENT);

    STATS_OPACITY = naifeitian.getValue("STATS_OPACITYGM") == null ? STATS_OPACITY : naifeitian.getValue("STATS_OPACITYGM");
    naifeitian.setValue("STATS_OPACITYGM", STATS_OPACITY);

    STATS_TEXT_SIZE = naifeitian.getValue("STATS_TEXT_SIZEGM") == null ? STATS_TEXT_SIZE : naifeitian.getValue("STATS_TEXT_SIZEGM");
    naifeitian.setValue("STATS_TEXT_SIZEGM", STATS_TEXT_SIZE);


    STATS_CONDITIONAL_FORMATTING = naifeitian.getValue("STATS_CONDITIONAL_FORMATTINGGM") == null ? STATS_CONDITIONAL_FORMATTING : naifeitian.getValue("STATS_CONDITIONAL_FORMATTINGGM");
    naifeitian.setValue("STATS_CONDITIONAL_FORMATTINGGM", STATS_CONDITIONAL_FORMATTING);

    if (useDefaultTouchControls == 1) {
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
                });
            }
            return dc;
        }
    }
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
                    if(framesDropped!==undefined){
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
        StreamStats.#$container = CE('div', {'class': 'better-xcloud-stats-bar better-xcloud-gone'},
                                 CE('label', {}, 'FPS'),
                                 StreamStats.#$fps = CE('span', {}, 0),
                                 CE('label', {}, 'PING'),
                                 StreamStats.#$rtt = CE('span', {}, '0ms'));

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

        StreamStats.#$settings = CE('div', {'class': 'better-xcloud-stats-settings'},
                                    CE('b', {}, 'Cài đặt thanh trạng thái'),
                                    CE('div', {},
                                       CE('label', {'for': `xcloud_setting_STATS_SHOW_WHEN_PLAYING`}, 'Mở Thống kê cùng với Game'),
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
                                       CE('label', {'for': `xcloud_setting_STATS_OPACITY`}, 'Độ rõ nét (10-100%)'),
                                       $opacity
                                      ),
                                    CE('div', {},
                                       CE('label', {'for': `xcloud_setting_STATS_TRANSPARENT`}, 'Nền trong suốt'),
                                       $transparent
                                      ),
                                    CE('div', {},
                                       CE('label', {'for': `xcloud_setting_STATS_CONDITIONAL_FORMATTING`}, 'Số Có Màu'),
                                       $formatting
                                      ),
                                    $close = CE('button', {}, 'Close'));

        $close.addEventListener('click', e => StreamStats.hideSettingsUi());
        document.documentElement.appendChild(StreamStats.#$settings);

        StreamStats.#refreshStyles();
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
        //HookProperty(windowCtx.navigator, "connection", undefined);
        Object.defineProperty(windowCtx.navigator, 'connection', {
            get: function () {
                return {
                    onchange: null,
                    effectiveType: '4g',
                    rtt: 0,
                    downlink: 10,
                    saveData: false,
                    addEventListener: function () {
                    },
                    removeEventListener: function () {
                    },
                }; // Official check: rtt >= 100 || downlink <= 10 || saveData || effectiveType is ["slow-2g","2g","3g"]
            }
        });
    }
    HookProperty(windowCtx.navigator, "standalone", true);

} catch (e) {}

//悬浮确认按钮
let confirmBtn = '.Button-module__typeBrand___MMuct';
//悬浮x按钮
let basic_X_Btn = '.EditErgoMenu-module__basicControlsButtonColor___hPHPz';
//basic不需要的Class
let basicFukClass = 'Button-module__overlayModeAcrylic___QnjAv';
//悬浮···
let threeDotBtn = '.Button-module__buttonIcon___540Jm';
//悬浮···后全屏
let threeDotClickedScreen = '.StreamMenu-module__container___gE8aQ';
//退出游戏确认按钮区域
let quitGameArea = '';
//退出游戏区域X和never mind按钮
let quitGame_X_nm_btn = '.PureInStreamConfirmationModal-module__closeButton___P2u+9';
//退出游戏确认按钮
let quitGameConfirmBtn = '.PureInStreamConfirmationModal-module__destructiveButton___PZgIz';
//微软logo
let mslogo=".c-sgl-stk-uhfLogo";
//开启basic的开关
let basicCheckBtn = '.Button-module__decoratedButton___-YJyr';
//悬浮窗6个点Box
let floatingSixDotBox = '.GripHandle-module__container___Ys9mS';
//悬浮窗6个点
let floatingSixDot = '.Grip-module__container___5o7HD';
//悬浮窗6个点left
let floatingSixDotLeft = '.StreamHUD-module__container___l-cp9';
//悬浮窗6个点left子1
let floatingSixDotLeftC1 = '.StreamHUD-module__buttonsContainer___SN1lD';
//悬浮窗6个点left子2
let floatingSixDotLeftC2 = '.GripHandle-module__container___Ys9mS';
//进游戏过程中左上角按钮
let inGameleftbtn = '.BackButton-module__backButton___Lncdq';
//选游页左上角
let cloudGameBeta='.Button-module__callToAction___mSaZg';
let cloudGameBetaC1='.CloudGamingButton-module__text___cffxB';
let cloudGameBetaC2='.CloudGamingButton-module__betaIcon___Xy-SS';
$.ajax({
    url: "https://greasyfork.org/scripts/461579-xbox-cloud-gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88%E6%A0%B7%E5%BC%8F/code/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88%E6%A0%B7%E5%BC%8F.user.js",
    type: "GET",
    async: false,
    timeout: 1000,
    success: function (data, textStatus) {
        var aPos = data.indexOf('//======//');
        var bPos = data.indexOf('//++++++//');
        var r = data.substr(aPos + 17, bPos - aPos - 17);
        var newCss = JSON.parse(r);
        //悬浮确认按钮
        confirmBtn = newCss['confirmBtn'];
        //悬浮x按钮
        basic_X_Btn = newCss['basic_X_Btn'];
        //basic不需要的Class
        basicFukClass = newCss['basicFukClass'];
        //悬浮···
        threeDotBtn = newCss['threeDotBtn'];
        //悬浮···后全屏
        threeDotClickedScreen = newCss['threeDotClickedScreen'];
        //退出游戏确认按钮区域
        quitGameArea = newCss['quitGameArea'];
        //退出游戏区域X和never mind按钮
        quitGame_X_nm_btn = newCss['quitGame_X_nm_btn'];
        //退出游戏确认按钮
        quitGameConfirmBtn = newCss['quitGameConfirmBtn'];
        //开启basic的开关
        basicCheckBtn = newCss['basicCheckBtn'];
        //微软logo
        mslogo=newCss['mslogo'];
        //悬浮窗6个点Box
        floatingSixDotBox = newCss['floatingSixDotBox'];
        //悬浮窗6个点
        floatingSixDot = newCss['floatingSixDot'];
        //悬浮窗6个点left
        floatingSixDotLeft = newCss['floatingSixDotLeft'];
        //悬浮窗6个点left子1
        floatingSixDotLeftC1 = newCss['floatingSixDotLeftC1'];
        //悬浮窗6个点left子2
        floatingSixDotLeftC2 = newCss['floatingSixDotLeftC2'];
        //进游戏过程中左上角按钮
        inGameleftbtn = newCss['inGameleftbtn'];
        //选游页左上角
        cloudGameBeta=newCss['cloudGameBeta'];
        cloudGameBetaC1=newCss['cloudGameBetaC1'];
        cloudGameBetaC2=newCss['cloudGameBetaC2'];
    },

    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log('error...状态文本值：' + textStatus + " 异常信息：" + errorThrown);
    }
});
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
                        console.log('xff欺骗开始' + url);
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
                        console.log('xff欺骗结束');
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
    } else if (url.indexOf('/v5/sessions/cloud/play') > -1) {


        document.documentElement.style.overflowY = "hidden";
        if (autoFullScreen == 1) {
            setMachineFullScreen();
        }
        $('#popSetting').css('display','none');

        let btnCss =
            basic_X_Btn + `{
        width:10px;
        min-width:10px;
        background-color:rgba(255,0,0,0)!important;
        overflow: hidden;
        color: white;
    }
    ` + floatingSixDotBox + `{
        background:rgba(0, 0, 0, 0)!important;
    }
    ` + floatingSixDot + `{
        opacity:0.3!important;
    }
    ` + floatingSixDotLeft + `{
        background-color:rgba(255,0,0,0)!important;
    }`
                + floatingSixDotLeftC1 + `{
        background-color:rgba(255,0,0,0)!important;
     }`
                + floatingSixDotLeftC2 + `{
        background-color:rgba(255,0,0,0)!important;
     }
`;
        if (videoResize == 1) {
            btnCss += `video{
               transform: scaleX(` + (videoX + 1) + `) scaleY(` + (videoY + 1) + `)}`;

        }
        var basicStyle = document.createElement('style');
        basicStyle.innerHTML = btnCss;
        var doc = document.head || document.documentElement;
        doc.appendChild(basicStyle);

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

                        json["settings"]["osName"]= high_bitrate==1?'windows':'android';
                        console.log("osName:",json["settings"]["osName"]);
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
    } else if (url.indexOf('/v2/titles') > -1) { // /v2/titles or /v2/titles/mru
        // Enable CustomTouchOverlay
        console.log('修改触摸开始')
        return new Promise((resolve, reject) => {
            originFetch(...arg).then(res => {
                res.json().then(json => {
                    // console.error(json);
                    try {
                        json["results"].forEach(result => {
                            if (result["details"]["supportedInputTypes"].includes("CustomTouchOverlay") === false) {
                                result["details"]["supportedInputTypes"].push("CustomTouchOverlay");
                                // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                            }
                            if (result["details"]["supportedInputTypes"].includes("MKB") === false) {
                                result["details"]["supportedInputTypes"].push("MKB");
                                // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                            }
                            if (result["details"]["supportedInputTypes"].includes("GenericTouch") === false) {
                                result["details"]["supportedInputTypes"].push("GenericTouch");
                                // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                            }
                            if (result["details"]["supportedInputTypes"].includes("NativeTouch") === false) {
                                result["details"]["supportedInputTypes"].push("NativeTouch");
                                // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                            }
                        });
                    } catch (err) {}
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

function exitGame() {
    StreamStats.stop();
    document.documentElement.style.overflowY = "";
    if (autoFullScreen == 1) {
        exitMachineFullscreen();
    }
    $('#popSetting').css('display', 'block');
}

$(document).on("click", basicCheckBtn,
               function () {
    if ($(this).attr('aria-checked') == 'true') {
        BasicControlsCheck = true;
    } else {
        BasicControlsCheck = false;
    }
});
$(document).on("click", confirmBtn,
               function () {
    if (BasicControlsCheck) {
        $(basic_X_Btn).removeClass(basicFukClass);
        $(basic_X_Btn).text('X');
    }
});

$(document).on("click", inGameleftbtn, function () {
    exitGame();
});
$(document).on('click', cloudGameBeta,function(){
    if($(this).attr('href')=='/play'){
        $('#settingsBackgroud').css('display','');
        naifeitian.killTouchMove('*');
        $('.settingsBackgroud').off('touchmove', false);
        $(this).text("⚙️Hiện");
        $(this).next().remove();
    }
});
$(document).on('click', cloudGameBetaC1,function(){
    $('#settingsBackgroud').css('display','');
    naifeitian.killTouchMove('*');
    $('.settingsBackgroud').off('touchmove', false);
    $(this).text("⚙️Hiện");
    $(this).next().remove();
});
$(document).on('click', cloudGameBetaC2,function(){
    $('#settingsBackgroud').css('display','');
    naifeitian.killTouchMove('*');
    $(this).prev().text("⚙️Hiện");
    $(this).remove();
    $('.settingsBackgroud').off('touchmove', false);
});
$(document).on('click', mslogo,function(){
    $('#settingsBackgroud').css('display','');
    $('*').on('touchmove', false);
    $('.settingsBackgroud').off('touchmove', false);
});
let needrefresh = 0;
function initSettingBox() {
    let boxCss = `
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

`;
    var settingBoxStyle = document.createElement('style');
    settingBoxStyle.innerHTML = boxCss;
    var doc = document.head || document.documentElement;
    doc.appendChild(settingBoxStyle);

    let dom = '';
    dom += `<label  style="display: block;text-align:center;"><div   style="display: inline;">Tool Xbox Cloud Việt Nam V4.0</lable> `;
    dom += `<label  style="display: block;text-align:center;"><div   style="display: inline;">Mua Gói Xbox Liên Hệ Zalo 0389940355</lable> `;
    dom += `</label><hr style="background-color: #007d06;width:95%" />`;
        dom += `</label><hr style="background-color: black;width:95%" />`;
        dom += `</label><hr style="background-color: black;width:95%" />`;
        dom += `</label><hr style="background-color: black;width:95%" />`;
    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Mở Tool：</div>`;
    dom += `<input type="radio" class='noNeedVpnListener settingsBoxInputRadio' style="outline:none;" name='noNeedVpn' id="noNeedVpnOpen" value="1" ${no_need_VPN_play == 1 ? 'checked' : ''}><label for="noNeedVpnOpen" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class='noNeedVpnListener settingsBoxInputRadio' style="outline:none;" name='noNeedVpn' id="noNeedVpnOff" value="0" ${no_need_VPN_play == 0 ? 'checked' : ''}><label for="noNeedVpnOff" style="padding-right: 15px;">Tắt</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Đồ Hoạ：</div>`;
    dom += `<input type="radio" class="high_bitrateListener settingsBoxInputRadio" style="outline:none;" name='highBitrate' id="high_bitrateOn" value="1" ${high_bitrate == 1 ? 'checked' : ''}><label for="high_bitrateOn" style="padding-right: 15px;">1080P</label>`;
    dom += `<input type="radio" class="high_bitrateListener settingsBoxInputRadio" style="outline:none;" name='highBitrate' id="high_bitrateOff" value="0" ${high_bitrate == 0 ? 'checked' : ''}><label for="high_bitrateOff" style="padding-right: 25px;">720P</label>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Phím Ảo Mọi Game：</div>`;
    dom += `<input type="radio" class="useDefaultTouchControlsListener settingsBoxInputRadio" style="outline:none;" name='useDefaultTouchControls' id="useDefaultTouchControlsOn" value="1" ${useDefaultTouchControls == 1 ? 'checked' : ''}><label for="useDefaultTouchControlsOn" style="padding-right: 15px;">Bật</label>`;
    dom += `<input type="radio" class="useDefaultTouchControlsListener settingsBoxInputRadio" style="outline:none;" name='useDefaultTouchControls' id="useDefaultTouchControlsOff" value="0" ${useDefaultTouchControls == 0 ? 'checked' : ''}><label for="useDefaultTouchControlsOff" style="padding-right: 25px;">Tắt</label>`;
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

    dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">Tràn Viền/Full Màn：</div>`;
    dom += `<input type="radio" class="videoResizeListener settingsBoxInputRadio" style="outline:none;" name='videoResize' id="videoResizeOn" value="1" ${videoResize == 1 ? 'checked' : ''}><label for="videoResizeOn" style="padding-right: 15px;">Mở</label>`;
    dom += `<input type="radio" class="videoResizeListener settingsBoxInputRadio" style="outline:none;" name='videoResize' id="videoResizeOff" value="0" ${videoResize == 0 ? 'checked' : ''}><label for="videoResizeOff" style="padding-right: 25px;">Tắt</label>`;


    dom += `<div id="videoXY" style="display: `;

    if (videoResize == 1) {
        dom += `block">`;
    } else {
        dom += `none">`;
    }
    dom += `<lable>Chiều Dọc :</lable><input type='text' style="outline: none;width: 50px;" id="videoY" class="videoYListener" value="${videoY}" placeholder="请输入数字"/>`
        dom += `<lable>Ngang :</lable><input type='text' style="outline: none;width: 50px;" id="videoX" class="videoXListener" value="${videoX}" placeholder="请输入数字"/>`

        dom += `</div>`;
    dom += `</label><hr style="background-color: black;width:95%" />`;

    dom += `<button class="closeSetting1 closeSetting2" style="outline: none;">Lưu</button>`

    dom += `</label><hr style="background-color: black;width:100%" />`;
    dom += `</label><hr style="background-color: black;width:100%" />`;
    dom += `</label><hr style="background-color: black;width:100%" />`;
    dom += `</label><hr style="background-color: black;width:100%" />`;
    dom += `<label  style="display: block;text-align:center;"><div   style="display: inline;">Việt Hoá By Đoàn Nguyễn</lable> `;

    dom +=`<div style="text-align: center;margin-top: 8px;color: #01060d;font-size: 16px;"><lable>Kênh Youtube : </lable><a style="margin-right:15px;outline: none;color: #ff424c;text-decoration: underline;" href="https://www.youtube.com/channel/UCxRnbvxANiOzYMs8qBpcJwg">XboxCloud Việt Nam</a></div>`

        dom += `<div style="text-align: right;margin-top: 8px;font-size: 16px;"><lable>Thông Tin：</lable><a style="margin-right:15px;outline: none;color: #e0191f;text-decoration: underline;" href="https://www.youtube.com/channel/UCxRnbvxANiOzYMs8qBpcJwg">Youtube</a><a style="outline: none;color: #0084f0;text-decoration: underline;" href="https://www.facebook.com/Doan7457">Facebook</a></div>`
        dom +=`<div style="text-align: center;margin-top: 8px;color:black font-size: 16px;"><lable>Donate Tác giả：</lable><a style="margin-right:15px;outline: none;color: ;text-decoration: underline;" href="https://raw.githubusercontent.com/Doann7457/7457/main/PNG/wechat.png">Wechat</a></div>`
        dom = '<div style="padding: 20px;color: black;display:none;" class="settingsBackgroud" id=\'settingsBackgroud\'>' + `<div class="settingsBox">` + dom + `</div>` + '</div>';

    $('body').append(dom);

    $(document).on('blur', '.videoXListener', function () {
        if (naifeitian.isNumber($(this).val())) {
            naifeitian.setValue('videoXGM', $(this).val());
        } else {
            $(this).val("0");
            naifeitian.setValue('videoXGM', '0');
            alert('请输入数字！');
        }
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });
    $(document).on('blur', '.videoYListener', function () {
        if (naifeitian.isNumber($(this).val())) {
            naifeitian.setValue('videoYGM', $(this).val());
        } else {
            $(this).val("0");
            naifeitian.setValue('videoYGM', '0');
            alert('请输入数字！');
        }
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.videoResizeListener', function () {
        if ($(this).val() == 0) {
            $('#videoXY').css('display', 'none');
        } else {
            $('#videoXY').css('display', '');
        }
        naifeitian.setValue('videoResizeGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.closeSetting1', function () {

        naifeitian.renewTouchMove('*');
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
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.languageSingleListener', function () {
        if ($(this).val() != 'Auto') {
            $('.IfErrUsedefaultGameLanguageBlock').css('display', 'none');
        } else {
            $('.IfErrUsedefaultGameLanguageBlock').css('display', 'block');
        }
        naifeitian.setValue('xcloud_game_languageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.IfErrUsedefaultGameLanguageListener', function () {
        naifeitian.setValue('IfErrUsedefaultGameLanguageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.noNeedVpnListener', function () {
        if ($(this).val() == 0) {
            $('.chooseRegionsBlock').css('display', 'none');;
        } else {
            $('.chooseRegionsBlock').css('display', 'block');
        }
        naifeitian.setValue('no_need_VPN_playGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
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
        $('.closeSetting1').text('Lưu ');
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
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.high_bitrateListener', function () {
        naifeitian.setValue('high_bitrateGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.autoFullScreenListener', function () {
        naifeitian.setValue('autoFullScreenGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.disableCheckNetworkListener', function () {
        naifeitian.setValue('disableCheckNetworkGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.useDefaultTouchControlsListener', function () {
        naifeitian.setValue('useDefaultTouchControlsGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('click', '.blockXcloudServerListener', function () {
        if ($(this).val() == 0) {
            $('.blockServerBlock').css('display', 'none');
        } else {
            $('.blockServerBlock').css('display', 'block');
        }
        naifeitian.setValue('blockXcloudServerGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });

    $(document).on('change', '.blockServerBlock', function () {
        naifeitian.setValue('defaultXcloudServerGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('Lưu ');
    });
}


$(document).on("click", quitGameConfirmBtn,
               function () {
    exitGame();
});


$(document).ready(function () {
    setTimeout(function () {
        var popCss = `

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

`;

        var xfbasicStyle = document.createElement('style');
        xfbasicStyle.innerHTML = popCss;
        var docxf = document.head || document.documentElement;
        docxf.appendChild(xfbasicStyle);

        $('body').append(`<div id="popSetting" style="display:block">⚙️Hiện</div>`);
        $(document).on('click', '#popSetting', function () {
            $('#settingsBackgroud').css('display', '');
            naifeitian.killTouchMove('*');
            $('.settingsBackgroud').off('touchmove', false);
        });
        let logoText=$(mslogo);
        if(logoText.attr('href')!=null && logoText.attr('href')!=""){
            logoText.removeAttr('href');
            logoText.css("color",'white');
            logoText.text("⚙️Hiện");
        }
        initSettingBox();
        StreamStats.render();
    }, 2000);

});

var timer;
var mousehidding = false;
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
var _pushState = window.history.pushState;
window.history.pushState = function() {
    if(arguments[2].substring(arguments[2].length,arguments[2].length-5)=='/play'){
        $('#popSetting').css('display','block');

    }else{
        $('#popSetting').css('display','none');

    }
    return _pushState.apply(this, arguments);
}


RTCPeerConnection.prototype.orgAddIceCandidate = RTCPeerConnection.prototype.addIceCandidate;
RTCPeerConnection.prototype.addIceCandidate = function(...args) {


    STREAM_WEBRTC = this;
    return this.orgAddIceCandidate.apply(this, args);
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
        if (e.target != $parent && e.target.id !== 'MultiTouchSurface') {
            return;
        }

        // Hide Quick settings bar
        $quickBar.style.display = 'none';

        $parent.removeEventListener('click', hideQuickBarFunc);
        $parent.removeEventListener('touchend', hideQuickBarFunc);

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

                // Create Stream Stats button
                const $btnStreamStats = cloneStreamMenuButton($orgButton, 'Hiển Thị PING FPS WIFI', ICON_STREAM_STATS);
                $btnStreamStats.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle Stream Stats
                    StreamStats.toggle();
                });

                // Insert after Video Settings button
                $orgButton.parentElement.insertBefore($btnStreamStats, $orgButton.parentElement.firstChild);

            });
        });
    });
    observer.observe($screen, {subtree: true, childList: true});
}
function patchVideoApi() {

    // Show video player when it's ready
    var showFunc;
    showFunc = function() {
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
    HTMLMediaElement.prototype.play = function() {

        this.addEventListener('playing', showFunc);
        injectVideoSettingsButton();

        return this.orgPlay.apply(this);
    };
}

patchVideoApi();

console.log("all done");
})();
