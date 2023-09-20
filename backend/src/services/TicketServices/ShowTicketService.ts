import Ticket from "../../models/Ticket";
import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import User from "../../models/User";
import Queue from "../../models/Queue";
import Whatsapp from "../../models/Whatsapp";
import ShowUserService from "../UserServices/ShowUserService";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";

const ShowTicketService = async (id: string | number): Promise<Ticket> => {
  const ticket = await Ticket.findByPk(id, {
    include: [
      {
        model: Contact,
        as: "contact",
        attributes: ["id", "name", "number", "profilePicUrl"],
        include: ["extraInfo"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"]
      },
      {
        model: Queue,
        as: "queue",
        attributes: ["id", "name", "color"]
      },
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["name"]
      }
    ]
  });

  if (ticket?.userId) {
    const user = await ShowUserService(ticket?.userId);

    if (ticket.unreadMessages > 0) {
      if (user.userStatus === 2 && ticket.lastMessage !== user.offlineMessage) {
        await SendWhatsAppMessage({
          ticket,
          body: user.offlineMessage
        });
      }

      if (user.userStatus === 3 && ticket.lastMessage !== user.awayMessage) {
        await SendWhatsAppMessage({
          ticket,
          body: user.awayMessage
        });
      }
    }
  }

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  return ticket;
};

export default ShowTicketService;
