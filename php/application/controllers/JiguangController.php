<?php
require_once APPLICATION_ROOT_PATH . 'models/JSMS.php';
require_once APPLICATION_ROOT_PATH . 'models/Util.php';
require_once APPLICATION_ROOT_PATH . 'models/Base.php';

class JiguangController extends Front_Controller_Action
{
    public function preDispatch()
    {
        $appKey = $this->config['jgappKey'];
        $masterSecret = $this->config['jgmasterSecret'];
        $this->_ms = new JSMS($appKey, $masterSecret, ['disable_ssl' => true]);
        $this->_base = new Base();
        $this->_util = new Util();
    }

    public function indexAction()
    {
        $this->render('index');
    }

    public function sendcodeAction()
    {
        try {
            $tel = json_decode(file_get_contents('php://input'), true)['tel'];
            $res = $this->_ms->sendCode($tel, 1);
            if (isset($res['body']['msg_id'])) {
                $_SESSION['tel'] = $tel;
                $_SESSION['msgid'] = $res['body']['msg_id'];
                $res = ['error' => 0, 'data' => true];
            } else {
                throw new Exception(json_encode($res['body']['error']));
            }
        } catch (Exception $e) {
            $this->_util->err($e);
            $res = ['error' => 1, 'data' => '短信发送失败'];
        }
        echo json_encode($res);
    }

    public function checkcodeAction()
    {
        try {
            $code = json_decode(file_get_contents('php://input'), true)['code'];
            $res = $this->_ms->checkCode($_SESSION['msgid'], $code);
            $res['body']['is_valid'] = true;
            if($res['body']['is_valid'] === true){
                $userid = $this->_base->select('fetchOne','user', array('col' => 'id', 'where' => array('tel = ?', $_SESSION['tel'])));
                if(!isset($userid)){
                    $userid = $this->_base->insert('user', array('tel' => $_SESSION['tel']));
                }
                $_SESSION['userid'] = $userid;
                $remain = 3 - $this->_base->select('fetchOne', 'apply', array('col' => 'COUNT(*)', 'where' => array(
                    array('userid = ?', $userid),
                    array('state = ?', '2')
                )));
                $res = ['error' => 0, 'data' => (string)$remain];
            }else{
                throw new Exception(json_encode($res['body']['error']));
            }
        } catch (Exception $e) {
            $this->_util->err($e);
            $res = ['error' => 1, 'data' => '短信验证未通过'];
        }
        echo json_encode($res);
    }
}
// D:\webservice\web\react\php\application\controllers\JiguangController.php:27:
// array (size=2)
//   'error' => int 0
//   'data' => 
//     array (size=3)
//       'headers' => 
//         array (size=8)
//           0 => string 'HTTP/1.1 200 ' (length=13)
//           'Server' => string 'nginx' (length=5)
//           'Date' => string 'Thu, 03 Jun 2021 03:32:37 GMT' (length=29)
//           'Content-Type' => string 'application/json;charset=UTF-8' (length=30)
//           'Transfer-Encoding' => string 'chunked' (length=7)
//           'Connection' => string 'keep-alive' (length=10)
//           'Vary' => string 'Accept-Encoding' (length=15)
//           'X-Application-Context' => string 'sms-codes-web-api:bjhw-prod:8080' (length=32)
//       'body' => 
//         array (size=1)
//           'msg_id' => string '330357625061377' (length=15)
//       'http_code' => int 200
// {"error":0,"data":{"headers":{"0":"HTTP\/1.1 200 ","Server":"nginx","Date":"Thu, 03 Jun 2021 03:32:37 GMT","Content-Type":"application\/json;charset=UTF-8","Transfer-Encoding":"chunked","Connection":"keep-alive","Vary":"Accept-Encoding","X-Application-Context":"sms-codes-web-api:bjhw-prod:8080"},"body":{"msg_id":"330357625061377"},"http_code":200}}