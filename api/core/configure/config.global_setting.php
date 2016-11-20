<?php

    session_start();

    date_default_timezone_set('Asia/Shanghai');

    $_SESSION['GLOBAL'] = null;

    $_SESSION['GLOBAL']['DEBUG'] = true;

    $_SESSION['GLOBAL']['template'] = 'v_01';

    $_SESSION['GLOBAL']['VERSION'] = "v_01";
    $_SESSION['GLOBAL']['ENGINE_PATH'] = "http://127.0.0.1/HonX/engine/";
    $_SESSION['GLOBAL']['RESOURCES_PATH'] = "http://127.0.0.1/HonX/resources/";

