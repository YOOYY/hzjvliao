<?php
require_once APPLICATION_ROOT_PATH . 'models/Index.php';
require_once APPLICATION_ROOT_PATH . 'models/Util.php';

class IndexController extends Front_Controller_Action
{
    public function preDispatch()
    {
        $this->wxappid = $this->config['wxappid'];
        $this->wxsecret = $this->config['wxsecret'];
        $this->_index = new Index();
        $this->_util = new Util();
    }

    public function indexAction()
    {
        $this->render('index');
    }

    public function applylistAction()
    {
        try {
            $province = $_GET['province'];
            $res = $this->_index->select('fetchAll', 'apply', array(
                'where' => array(
                    array('province=?', $province),
                    array('state=?', 1)
                ),
                'order' => 'weight DESC'
            ));
            $res = ['error' => 0, 'data' => $res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function maplistAction()
    {
        try {
            $res = $this->_index->maplist();
            $res = ['error' => 0, 'data' => $res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function videolistAction()
    {
        try {
            $res = $this->_index->select('fetchCol', 'video', array('col'=>'path'));
            $res = ['error' => 0, 'data' => $res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function applyAction()
    {
        try {
            $type = $_POST['type'];
            unset($_POST['type']);
            print_r($_FILES);
            print_r($_POST);
            $urls = $this->_index->upfiles($_FILES, $_POST);
            print_r($urls);

            if(isset($urls['photos'])){
                $urls['photos'] = implode(',', $urls['photos']);
            }
            if(!is_array($urls)){
                $urls = array('avatar'=> $urls);
            }

            $row = array_merge($_POST, $urls);
            if(isset($_SESSION['userid'])){
                $row['userid'] = $_SESSION['userid'];
            }
            $res = $this->_index->insert($type, $row);
            $res = ['error' => 0, 'data' => $res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function wechatloginAction()
    {
        try {
            $code = json_decode(file_get_contents('php://input'), true)['code'];
            if(!isset($_SESSION['wechatInfo'])){
                $access_token = $this->_index->Get("https://api.weixin.qq.com/sns/oauth2/access_token?appid={$this->wxappid}&secret={$this->wxsecret}&code={$code}&grant_type=authorization_code");
                $access_token = json_decode($access_token,true);
                if(isset($access_token['errcode'])){
                    throw new Exception("登录失败,错误码". $access_token['errcode']);
                }
                $access_token['gettime'] = time();
                $userinfo = $this->_index->Get("https://api.weixin.qq.com/sns/userinfo?access_token={$access_token['access_token']}&openid={$access_token['openid']}");
                $userinfo = json_decode($userinfo, true);
                if (isset($userinfo['errcode'])) {
                    throw new Exception("登录失败,错误码" . $userinfo['errcode']);
                }
                $_SESSION['wechatInfo'] = array_merge($access_token, $userinfo);
                $userinfo['openid'] = $access_token['openid'];
                $userinfo['unionid'] = $access_token['unionid'];
                $userinfo['privilege'] = implode(',',$userinfo['privilege']);
                $userid = $this->_index->select('fetchOne', 'user', array('col' => 'id', 'where' => array('openid = ?', $userinfo['openid'])));
                if(isset($userid)){
                    $this->_index->update('user', $userinfo, array('id = ?', $userid));
                }else{
                    $userid = $this->_index->insert('user', $userinfo);
                }
            }else if(isset($_SESSION['wechatInfo']) && ($_SESSION['wechatInfo']['gettime'] + 7170) <= time()){
                $access_token = $this->_index->Get("https://api.weixin.qq.com/sns/oauth2/refresh_token?appid={$this->wxappid}&grant_type=refresh_token&refresh_token={$_SESSION['wechatInfo']['refresh_token']}");
                $access_token = json_decode($access_token, true);
                if (isset($access_token['errcode'])) {
                    throw new Exception("登录失败,错误码" . $access_token['errcode']);
                }
                $access_token['gettime'] = time();
                $userinfo = $this->_index->Get("https://api.weixin.qq.com/sns/userinfo?access_token={$access_token['access_token']}&openid={$access_token['openid']}");
                $userinfo = json_decode($userinfo, true);
                if (isset($userinfo['errcode'])) {
                    throw new Exception("登录失败,错误码" . $userinfo['errcode']);
                }
                $_SESSION['wechatInfo'] = array_merge($_SESSION['wechatInfo'],$access_token, $userinfo);
                $userinfo['openid'] = $access_token['openid'];
                $userinfo['unionid'] = $_SESSION['wechatInfo']['unionid'];
                $userinfo['privilege'] = json_encode($userinfo['privilege']);
                $res = $this->_index->update('user', $userinfo,array('openid = ?', $access_token['openid']));
                $userid = $this->_index->select('fetchOne', 'user', array('col' => 'id', 'where' => array('openid = ?', $userinfo['openid'])));
            }else{
                $userid = $this->_index->select('fetchOne', 'user', array('col' => 'id', 'where' => array('openid = ?', $_SESSION['wechatInfo']['openid'])));
            }
            $_SESSION['userid'] = $userid;
            $remain = 3 - $this->_index->select('fetchOne', 'apply', array('col' => 'COUNT(*)', 'where' => array(
                array('userid = ?', $userid),
                array('state = ?', '2')
            )));
            $res = ['error' => 0, 'data' => (string)$remain];
        } catch (Exception $e) {
            $res = ['error' => 1, 'data' => $e];
            $this->_util->err($e);
        }
        echo json_encode($res);
    }
}
