<?php

    class AuthConfig {

        /**
         * @param string $key
         * @return string|null
         */
        protected function get($key) {

            // 引入秘钥配置
            require_once dirname(__FILE__) . '/../configure/config.auth.php';

            return isset($secretKey[strtolower($key)]) ? $secretKey[strtolower($key)] : null;
        }
    }