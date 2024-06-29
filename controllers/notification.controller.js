const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllNotification: async (req, res, next) => {
    try {
      const notifications = await prisma.notification.findMany();
      return res.status(200).json({
        status: true,
        message: "Notifikasi berhasil diambil",
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  getNotificationById: async (req, res, next) => {
    const user = req.user;
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          user_id: user.user_id,
        },
      });

      await prisma.notification.updateMany({
        where: { user_id: user.user_id, isRead: false },
        data: { isRead: true },
      });

      return res.status(200).json({
        status: true,
        message: "Notifikasi berhasil diambil",
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },
};
