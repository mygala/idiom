<?php

    class Logs {

        private static $firePhp = null;

        /**
         * 获取FirePHP对象
         *
         * @return object
         */
        public static function getFirePhp() {
            return self::$firePhp;
        }

        /**
         * 设置FirePHP对象
         *
         * @param object $firePhp
         */
        public static function setFirePhp($firePhp) {
            self::$firePhp = $firePhp;
        }

        /**
         * Debug if debug enabled
         *
         * @param string $msg
         * @param string $label
         */
        public static function debug($msg, $label = null) {
            if (self::$firePhp) {
                self::$firePhp->log($msg, $label);
            }
        }

    }

