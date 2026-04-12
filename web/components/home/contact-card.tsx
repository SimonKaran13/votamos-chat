import HomeSocialMediaIcon from '@/components/icons/home-social-media-icon';

function ContactCard() {
  return (
    <div className="flex flex-col rounded-md border border-border">
      <div className="flex grow flex-col justify-between p-4">
        <div>
          <h2 className="font-bold">No te pierdas nada</h2>
          <p className="text-sm text-muted-foreground">
            Síguenos en nuestras redes o escríbenos por E-mail.
          </p>
        </div>
        <div className="mt-4 flex flex-row items-center gap-3">
          <HomeSocialMediaIcon type="instagram" />
          <HomeSocialMediaIcon type="linkedin" />
          <HomeSocialMediaIcon type="email" />
        </div>
      </div>
    </div>
  );
}

export default ContactCard;
