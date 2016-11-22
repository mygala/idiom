<?php

    require_once dirname(__FILE__) . '/../core/auth/auth.class.php';

    class IdiomAuth extends Auth {

        private $string;
        private $sign;

        public function __construct($string, $sign) {
            $this->string = $string;
            $this->sign   = $sign;
        }

        /**
         * 验证接口调用签名(idiom)
         *
         * @return bool
         */
        public function sign() {

            // 调用父方法验证签名
            return parent::sign($this->string, $this->sign, "idiom");
        }
    }