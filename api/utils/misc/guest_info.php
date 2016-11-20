<?php

    class GuestInfo {

        /**
         * 获取浏览器语言
         *
         * @return string
         */
        public static function getLang() {
            return substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 5);
        }

        /**
         * 获取浏览器信息
         *
         * @return string
         */
        public static function getBrowser() {

            $browser = $_SERVER['HTTP_USER_AGENT'];

            if (preg_match('/MSIE/i', $browser)) {
                $browser = 'MSIE';
            } else if (preg_match('/Firefox/i', $browser)) {
                $browser = 'Firefox';
            } else if (preg_match('/Chrome/i', $browser)) {
                $browser = 'Chrome';
            } else if (preg_match('/Safari/i', $browser)) {
                $browser = 'Safari';
            } else if (preg_match('/Opera/i', $browser)) {
                $browser = 'Opera';
            } else {
                $browser = 'Other';
            }

            return $browser;

        }

        /**
         * 获取操作系统
         *
         * @return string
         */
        public static function getOS() {

            $os = $_SERVER['HTTP_USER_AGENT'];

            if (preg_match('/win/i', $os)) {
                $os = 'Windows';
            } else if (preg_match('/mac/i', $os)) {
                $os = 'MAC';
            } else if (preg_match('/linux/i', $os)) {
                $os = 'Linux';
            } else if (preg_match('/unix/i', $os)) {
                $os = 'Unix';
            } else if (preg_match('/bsd/i', $os)) {
                $os = 'BSD';
            } else {
                $os = 'Other';
            }

            return $os;

        }

        /**
         * 获取IP地址
         *
         * @return string
         */
        public static function getIP() {

            if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                $ip = explode(',', $_SERVER['HTTP_CLIENT_IP']);
            } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            } else if (!empty($_SERVER['REMOTE_ADDR'])) {
                $ip = explode(',', $_SERVER['REMOTE_ADDR']);
            } else {
                $ip[0] = '';
            }

            return $ip[0];

        }

    }

