import SvgIcon from '@/components/svg-icon';
import { useAuth } from '@/hooks/auth-hooks';
import {
  useLogin,
  useLoginChannels,
  useLoginWithChannel,
} from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'umi';
import RightPanel from './right-panel';

import styles from './index.less';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: signLoading } = useLogin();
  const { channels, loading: channelsLoading } = useLoginChannels();
  const { login: loginWithChannel, loading: loginWithChannelLoading } =
    useLoginWithChannel();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const loading = signLoading || channelsLoading || loginWithChannelLoading;

  const { isLogin } = useAuth();
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const handleLoginWithChannel = async (channel: string) => {
    await loginWithChannel(channel);
  };

  const [form] = Form.useForm();

  const onCheck = async () => {
    try {
      const params = await form.validateFields();

      const rsaPassWord = rsaPsw(params.password) as string;

      const code = await login({
        email: `${params.email}`.trim(),
        password: rsaPassWord,
      });
      if (code === 0) {
        navigate('/');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const formItemLayout = {
    labelCol: { span: 6 },
    // wrapperCol: { span: 8 },
  };

  return (
    <div className={styles.loginPage}>
      {/* 左上角logo和文字 */}
      <div className={styles.logoContainer}>
        <img src="/Htai_logo/ht_logo.png" alt="宏泰logo" className={styles.logo} />
        <div className={styles.logoText}>
          <div className={styles.hongtai}>宏泰</div>
          <div className={styles.kingtronics}>KINGTRONICS</div>
        </div>
      </div>
      
      <div className={styles.loginLeft}>
        <div className={styles.leftContainer}>
          <div className={styles.loginTitle}>
            <div>{t('login')}</div>
            <span>{t('loginDescription')}</span>
          </div>

          <Form
            form={form}
            layout="vertical"
            name="dynamic_rule"
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              {...formItemLayout}
              name="email"
              label={t('emailLabel')}
              rules={[{ required: true, message: t('emailPlaceholder') }]}
            >
              <Input size="large" placeholder={t('emailPlaceholder')} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="password"
              label={t('passwordLabel')}
              rules={[{ required: true, message: t('passwordPlaceholder') }]}
            >
              <Input.Password
                size="large"
                placeholder={t('passwordPlaceholder')}
                onPressEnter={onCheck}
              />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox> {t('rememberMe')}</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              block
              size="large"
              onClick={onCheck}
              loading={loading}
            >
              {t('login')}
            </Button>
            {channels && channels.length > 0 && (
              <div className={styles.thirdPartyLoginButton}>
                {channels.map((item) => (
                  <Button
                    key={item.channel}
                    block
                    size="large"
                    onClick={() => handleLoginWithChannel(item.channel)}
                    style={{ marginTop: 10 }}
                  >
                    <div className="flex items-center">
                      <SvgIcon
                        name={item.icon || 'sso'}
                        width={20}
                        height={20}
                        style={{ marginRight: 5 }}
                      />
                      Sign in with {item.display_name}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </Form>
        </div>
      </div>
      <div className={styles.loginRight}>
        <RightPanel></RightPanel>
      </div>
    </div>
  );
};

export default Login;
