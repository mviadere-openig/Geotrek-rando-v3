import { LogoButton } from 'components/LogoButton';
import { Twitter } from 'components/Icons/Twitter';
import { Globe } from 'components/Icons/Globe';
import { Instagram } from 'components/Icons/Instagram';
import { Facebook } from 'components/Icons/Facebook';
import { YouTube } from 'components/Icons/YouTube';
import { SocialNetwork } from '../interface';

interface SocialNetworkProps {
  socialNetworkList: SocialNetwork[];
}

const socialNetworksIcons: { [key: string]: React.ReactNode } = {
  twitter: <Twitter size={16} />,
  facebook: <Facebook size={16} />,
  instagram: <Instagram size={20} />,
  youtube: <YouTube size={16} />,
  fallback: <Globe size={20} />,
};

export const SocialNetworks: React.FC<SocialNetworkProps> = ({ socialNetworkList }) => {
  return (
    <div
      className="
          flex justify-center space-x-6
          py-4 desktop:py-10
          border-b border-solid border-greySoft"
    >
      {socialNetworkList.map(socialNetwork => (
        // Using <a> for external links (<Link /> is only for internal routes with next).
        // target and rel are set so the link opens in a new tab.
        <a
          href={socialNetwork.url}
          key={socialNetwork.id}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LogoButton>{getSocialNetworkIcon(socialNetwork.id)}</LogoButton>
        </a>
      ))}
    </div>
  );
};

const getSocialNetworkIcon = (socialNetworkId: string): React.ReactNode | null => {
  if (Object.keys(socialNetworksIcons).includes(socialNetworkId)) {
    return socialNetworksIcons[socialNetworkId];
  }
  return socialNetworksIcons.fallback;
};
