<?php

    /* runtime start */

    ini_set('display_errors', true);

    if (!session_id()) {
        session_start();
    }

    ob_start();

    /* 引入全局配置参数 开始 */
    if (file_exists(dirname(__FILE__) . '/../core/configure/config.global_setting.php')) {
        require_once dirname(__FILE__) . '/../core/configure/config.global_setting.php';
    }
    /* 引入全局配置参数 结束 */

    /* 引入返回码 开始 */
    if (file_exists(dirname(__FILE__) . '/../core/configure/config.code.php')) {
        require_once dirname(__FILE__) . '/../core/configure/config.code.php';
    }
    /* 引入返回码 结束 */

    /* 加载Validate类 开始 */
    if (file_exists(dirname(__FILE__) . '/misc/validate.class.php')) {
        require_once dirname(__FILE__) . '/misc/validate.class.php';
    }
    /* 加载Validate类 结束 */

    /* 加载Output类 开始 */
    if (file_exists(dirname(__FILE__) . '/misc/output.class.php')) {
        require_once dirname(__FILE__) . '/misc/output.class.php';
    }
    /* 加载Output类 结束 */

    /* 加载Local类 开始 */
    if (file_exists(dirname(__FILE__) . '/misc/local.class.php')) {
        require_once dirname(__FILE__) . '/misc/local.class.php';
    }
    /* 加载Local类 结束 */

    if (file_exists(dirname(__FILE__) . '/misc/logs.php')) {
        /* 加载Logs类 开始 */
        require_once dirname(__FILE__) . '/misc/logs.php';
        /* 加载Logs类 结束 */

        /* 初始化FirePHP 开始 */
        if ($_SESSION['GLOBAL']['DEBUG'] === true) {
            if (file_exists(dirname(__FILE__) . '/FirePHP/fb.php')) {

                require_once dirname(__FILE__) . '/FirePHP/fb.php';

                $_SESSION['GLOBAL']['FIREPHP'] = FirePHP::getInstance(true);
                $_SESSION['GLOBAL']['FIREPHP']->setEnabled(true);

                Logs::setFirePhp($_SESSION['GLOBAL']['FIREPHP']);
            }
        }
        /* 初始化FirePHP 结束 */
    }

    // 设置时间戳
    $timestamp = time();

    /* runtime end */

