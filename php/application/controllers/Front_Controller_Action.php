<?php

/**
 *  这是所有action的起点,对ZF做设置.所有action都继承于此
 *  @package base
 */
require_once 'Zend/Controller/Action.php';
class Front_Controller_Action extends Zend_Controller_Action
{

    /**
     * config 系统的配置文件
     * 
     * @var array
     * @access protected
     */
    protected $config = array(); //定义为私有数组

    public function init()
    {
        //系统的配置文件
        $this->config = Zend_Registry::get('config');

        //配置视图
        $this->_configView();

        $actionName = $this->_getParam('action');
        $controllerName = $this->_getParam('controller');
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Origin: http://localhost:8080");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        header("Access-Control-Allow-Credentials: true");
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit;
        }
        SESSION_START();
        $this->_authenticate($actionName,$controllerName);
    }

    /**
     * _configView 配置视图
     * 
     * @access private
     * @return void
     * @author RD
     */
    private function _configView() /* {{{ */
    {
        //模板的后缀为php
        $this->_helper->viewRenderer->setViewSuffix('php');
        //不自动输出模板内容
        $this->_helper->viewRenderer->setNoRender(true);
        //设置视图默认路径，视图编码
        $this->view->setBasePath(APPLICATION_ROOT_PATH . "views")->setEncoding("utf-8");
        //视图的基础变量
        $this->view->baseUrl = str_replace(strrchr($_SERVER['SCRIPT_NAME'], '/'), '', $_SERVER['SCRIPT_NAME']) . '/';
        $this->view->webUrl = ((int)$_SERVER['SERVER_PORT'] == 443 ? 'https' : 'http') . '://'.$_SERVER['HTTP_HOST'].'/';
        $this->view->controllername = $this->_getParam('controller');
        $this->view->title = $this->config['sitename']; //网站(非控制面板)默认的title
        $this->view->keywords = $this->config['sitename'];
        $this->view->description = $this->config['sitename'];
        $this->view->version = $this->config['version']; //css文件最后一次版本号
        $this->view->imgUrl = $this->config['imgUrl'];
        $this->view->cssUrl = $this->config['cssUrl'];
        $this->view->jsUrl = $this->config['jsUrl'];
        $this->view->mimgUrl = $this->view->imgUrl . $this->view->controllername . '/';
    }

    /* }}} */

    /**
     * redirect 页面跳转
     * 
     * @param string $url ex.user/login
     * @param string $msg 提示内容
     * @param int $wait_time 等待时间
     * @access public
     * @return void
     * @author CJ <keepwatch@gmail.com>
     * @throws void
     */
    public function redirect($url = '', $msg = '', $wait_time = null) /* {{{ */
    {
        //如果url不指定,则默认去首页
        $this->view->redirect_url = $url;
        //如果msg不指定,使用模板里的默认语言
        $this->view->msg = $msg;
        //如果等待时间不指定,从配置文件里取
        if (null === $wait_time)
            $wait_time = $this->config['redirect_default_wait_time'];
        $this->view->wait_time = $wait_time;

        //模板的路径不使用子文件夹
        $this->render('redirect', null, true);
    }

    /* }}} */

    /**
     * showSystemError 模块出错时,显示错误页面给用户看
     * 
     * @param string $msg 
     * @access public
     * @return void
     * @author CJ <keepwatch@gmail.com>
     * @throws void
     */
    function showSystemError($msg = '') /* {{{ */
    {
        //如果msg不指定,使用模板里的默认语言
        $this->view->msg = $msg;

        //模板的路径不使用子文件夹
        $this->render('error/error', null, true);
    }

    private function _authenticate($actionName, $controllerName)
    {
        if ($controllerName == 'index' || $actionName == 'login' || $controllerName == 'jiguang') {
            return;
        }

        require_once APPLICATION_ROOT_PATH . '/models/Admin.php';
        $admin = new Admin();
        if (!$admin->checkLogin()) {
            $res = ['error' => 1, 'data' => '未登录'];
            exit(json_encode($res));
        }
    }
}
